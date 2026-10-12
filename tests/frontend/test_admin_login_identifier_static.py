from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
INDEX_HTML = (ROOT / "frontend" / "index.html").read_text(encoding="utf-8")
AUTH_JS = (ROOT / "frontend" / "auth.js").read_text(encoding="utf-8")
LANGUAGE_JS = (ROOT / "frontend" / "language.js").read_text(encoding="utf-8")


def test_login_form_accepts_phone_or_admin_username():
    assert "Phone or Admin username" in INDEX_HTML
    assert 'name="login_identifier"' in INDEX_HTML
    assert 'autocomplete="username"' in INDEX_HTML
    assert 'maxlength="50"' in INDEX_HTML


def test_login_validation_message_mentions_admin_username():
    assert "Admin username and password." in AUTH_JS


def test_bilingual_dictionary_contains_admin_login_label():
    assert '"Phone or Admin username"' in LANGUAGE_JS
    assert "t\\u00ean Admin" in LANGUAGE_JS
