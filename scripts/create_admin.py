"""Create the first LungXrayAI administrator from the command line.

This utility is intentionally not exposed through the Web UI. It is intended
for the person installing a fresh LungXrayAI instance and refuses to create a
second administrator once an ADMIN account already exists.
"""

from __future__ import annotations

import getpass

from pydantic import EmailStr, TypeAdapter, ValidationError


ADMIN_ROLE = "ADMIN"
USERNAME_MIN_LENGTH = 3
USERNAME_MAX_LENGTH = 50
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 128

_EMAIL_ADAPTER = TypeAdapter(EmailStr)


class AdminSetupError(ValueError):
    """Raised when first-administrator setup cannot be completed."""


def normalize_username(value: str) -> str:
    username = value.strip()

    if not (
        USERNAME_MIN_LENGTH
        <= len(username)
        <= USERNAME_MAX_LENGTH
    ):
        raise AdminSetupError(
            "Username must contain between "
            f"{USERNAME_MIN_LENGTH} and "
            f"{USERNAME_MAX_LENGTH} characters."
        )

    if any(character.isspace() for character in username):
        raise AdminSetupError(
            "Username must not contain whitespace."
        )

    return username


def normalize_email(value: str) -> str:
    candidate = value.strip().lower()

    try:
        return str(
            _EMAIL_ADAPTER.validate_python(candidate)
        ).lower()
    except ValidationError as exc:
        raise AdminSetupError(
            "Enter a valid email address."
        ) from exc


def validate_password(password: str) -> str:
    if not (
        PASSWORD_MIN_LENGTH
        <= len(password)
        <= PASSWORD_MAX_LENGTH
    ):
        raise AdminSetupError(
            "Password must contain between "
            f"{PASSWORD_MIN_LENGTH} and "
            f"{PASSWORD_MAX_LENGTH} characters."
        )

    return password


def collect_credentials() -> tuple[str, str, str]:
    print("LungXrayAI - First Administrator Setup")
    print("--------------------------------------")
    print(
        "This command creates the first ADMIN account "
        "for this installation."
    )
    print()

    username = normalize_username(
        input("Admin username: ")
    )
    email = normalize_email(
        input("Admin email: ")
    )
    password = validate_password(
        getpass.getpass("Admin password: ")
    )
    confirm_password = getpass.getpass(
        "Confirm password: "
    )

    if password != confirm_password:
        raise AdminSetupError(
            "Passwords do not match."
        )

    return username, email, password



def find_existing_admin(db):
    """Return the first ADMIN account if one already exists."""

    from sqlalchemy import select

    from lung_xray_api.infrastructure.persistence.orm import UserModel

    return db.scalar(
        select(UserModel)
        .where(UserModel.role == ADMIN_ROLE)
        .limit(1)
    )


def create_first_admin(
    db,
    *,
    username: str,
    email: str,
    password: str,
):
    """Create one ADMIN only when the installation has no ADMIN yet."""

    # Imports are intentionally local so validation helpers can be tested
    # without requiring database environment variables at import time.
    from sqlalchemy import select

    from lung_xray_api.core.security import hash_password
    from lung_xray_api.infrastructure.persistence.orm import UserModel
    from lung_xray_api.infrastructure.persistence.repositories.user_repository import (
        UserRepository,
    )

    repository = UserRepository()

    existing_admin = find_existing_admin(db)

    if existing_admin is not None:
        raise AdminSetupError(
            "An administrator already exists "
            f"(username: {existing_admin.username}). "
            "No additional administrator was created."
        )

    if repository.get_by_username(db, username) is not None:
        raise AdminSetupError(
            "Username already exists."
        )

    if repository.get_by_email(db, email) is not None:
        raise AdminSetupError(
            "Email already exists."
        )

    return repository.create(
        db,
        username=username,
        email=email,
        password_hash=hash_password(password),
        role=ADMIN_ROLE,
    )


def main() -> int:
    # Check the database before prompting for any credentials.
    try:
        from lung_xray_api.infrastructure.persistence.database import SessionLocal

        with SessionLocal() as db:
            existing_admin = find_existing_admin(db)
    except Exception as exc:
        print("LungXrayAI - First Administrator Setup")
        print("--------------------------------------")
        print(
            "Setup failed while connecting to the database."
        )
        print(
            "Make sure the application database is running and all "
            "Alembic migrations have completed."
        )
        print(f"Details: {exc}")
        return 1

    if existing_admin is not None:
        print("LungXrayAI - First Administrator Setup")
        print("--------------------------------------")
        print(
            "Setup stopped: An administrator already exists "
            f"(username: {existing_admin.username})."
        )
        print("No additional administrator was created.")
        return 2

    try:
        username, email, password = collect_credentials()
    except (AdminSetupError, EOFError) as exc:
        print(f"Setup failed: {exc}")
        return 1
    except KeyboardInterrupt:
        print("\nSetup cancelled.")
        return 130

    try:
        with SessionLocal() as db:
            admin = create_first_admin(
                db,
                username=username,
                email=email,
                password=password,
            )
    except AdminSetupError as exc:
        print(f"Setup stopped: {exc}")
        return 2
    except Exception as exc:
        print(
            "Setup failed while connecting to or updating the database."
        )
        print(
            "Make sure the application database is running and all "
            "Alembic migrations have completed."
        )
        print(f"Details: {exc}")
        return 1

    print()
    print("Administrator created successfully.")
    print(f"Username: {admin.username}")
    print(f"Email: {admin.email}")
    print(f"Role: {admin.role}")
    print()
    print(
        "You can now sign in to LungXrayAI using the administrator "
        "username and password you just created."
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
