from playwright.sync_api import sync_playwright, Page, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        print("Navigating to Login page at http://localhost:5173/login...")
        page.goto("http://localhost:5173/login", timeout=60000)

        print("Waiting for Login page to load...")
        expect(page.get_by_role("heading", name="Lectura")).to_be_visible(timeout=15000)
        time.sleep(2) # Allow animations to settle
        print("Taking screenshot of Login page...")
        page.screenshot(path="jules-scratch/verification/01_login_page.png", full_page=True)

        print("Navigating to Signup page...")
        page.get_by_role("link", name="Create one").click()

        print("Waiting for Signup page to load...")
        expect(page.get_by_text("Create a New Pilot Profile")).to_be_visible(timeout=15000)
        time.sleep(2) # Allow animations to settle
        print("Taking screenshot of Signup page...")
        page.screenshot(path="jules-scratch/verification/02_signup_page.png", full_page=True)

        print("Filling out signup form...")
        page.get_by_label("Full Name").fill("Test User")
        page.get_by_label("Username").fill("testuser")
        page.get_by_label("Email").fill("test@example.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_label("Repeat Password").fill("password123")
        page.get_by_role("button", name="Register").click()

        print("Waiting for verification message screen...")
        expect(page.get_by_text("Verify Your Email")).to_be_visible(timeout=15000)
        time.sleep(2) # Allow animations to settle
        print("Taking screenshot of Signup success page...")
        page.screenshot(path="jules-scratch/verification/03_signup_success.png", full_page=True)

        print("Verification script finished successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)