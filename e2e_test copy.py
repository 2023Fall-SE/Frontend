from selenium import webdriver


driver = webdriver.Chrome()
driver.get('http://localhost:3000')
print('Page Title:', driver.title)
driver.quit()