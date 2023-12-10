from selenium import webdriver
from selenium.webdriver.chrome.service import Service

service = Service(executable_path='./chromedriver')
driver = webdriver.Chrome(service=service)
driver.get('http://localhost:3000')
print('Page Title:', driver.title)
driver.quit()