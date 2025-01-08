![Envoy logo](../Resources/images/logo.png)

<p style="text-align: center; font-size: 50px;">ENVOY</p>

<p style="text-align: center; font-size: 25px;">To start with the workshop, please clone this repository.</p>

### General steps of completing the assignments:
#### Step 1
Complete the missing parts of the assignment following the instructions given for each one of them, in the respective folder
#### Step 2
After completing the missing part of the assignment, 
```yaml
    docker-compose up --build
```
#### Step 3
Check if all of the containers are running inside your docker or using the following cmd command.
```yaml
    docker ps --format "{{.ID}}: {{.Names}} ({{.Status}})"
```
#### Step 4
Test the connection. Go to a client browser / postman, and verify that the proxy is working correctly, using Envoy's expose port 
```yaml
    http://localhost:8080/{different services}
```
Select the desired service you want to test out. Make sure the method you are using - GET/POST is the correct one, otherwise it wouldn't work!
#### Step 5
Shutdown the server
```yaml
    docker-compose down
```
Please make sure to use this command every time you finish an assingment, otherwise the new assignments you will be working on, will not work properly!