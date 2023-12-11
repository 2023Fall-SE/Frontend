from selenium import webdriver
from selenium.webdriver.chrome.service import Service

service = Service(executable_path='./chromedriver-linux64/chromedriver')

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--headless') 

driver = webdriver.Chrome(service=service,options=chrome_options)
driver.get('http://localhost:3000')
print('Page Title:', driver.title)
driver.quit()