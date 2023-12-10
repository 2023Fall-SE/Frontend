from selenium import webdriver

chrome_driver_path = '/chromedriver'
driver = webdriver.Chrome(executable_path=chrome_driver_path)


driver.get('http://localhost:3000')


print('Page Title:', driver.title)
driver.quit()