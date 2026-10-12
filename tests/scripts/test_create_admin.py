import importlib

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from scripts.create_admin import (
    AdminSetupError,
    create_first_admin,
    normalize_email,
    normalize_username,
    validate_password,
)


def test_admin_input_validation():
    assert normalize_username("  myadmin  ") == "myadmin"
    assert normalize_email(" Admin@Example.COM ") == "admin@example.com"
    assert validate_password("StrongPass123!") == "StrongPass123!"

    with pytest.raises(AdminSetupError):
        normalize_username("ab")

    with pytest.raises(AdminSetupError):
        normalize_username("admin name")

    with pytest.raises(AdminSetupError):
        normalize_email("not-an-email")

    with pytest.raises(AdminSetupError):
        validate_password("short")


def test_create_first_admin_refuses_second_admin(monkeypatch):
    monkeypatch.setenv("DB_PASSWORD", "test-password")
    monkeypatch.setenv("JWT_SECRET", "test-jwt-secret")

    # Ensure settings see the test environment if another test imported them.
    import lung_xray_api.core.config as config_module

    config_module.get_settings.cache_clear()
    config_module.settings = config_module.get_settings()

    import lung_xray_api.core.security as security_module

    importlib.reload(security_module)

    from lung_xray_api.infrastructure.persistence.orm import UserModel

    engine = create_engine("sqlite+pysqlite:///:memory:")
    UserModel.__table__.create(engine)
    Session = sessionmaker(bind=engine)

    with Session() as db:
        admin = create_first_admin(
            db,
            username="firstadmin",
            email="first@example.com",
            password="StrongPass123!",
        )

        assert admin.username == "firstadmin"
        assert admin.role == "ADMIN"

        with pytest.raises(
            AdminSetupError,
            match="administrator already exists",
        ):
            create_first_admin(
                db,
                username="secondadmin",
                email="second@example.com",
                password="AnotherPass123!",
            )
