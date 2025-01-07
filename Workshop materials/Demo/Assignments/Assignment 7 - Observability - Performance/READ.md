# Assignment 7 - Instructions

Link to Envoy's documentation about Health checking - 
https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/health_checking.html

### Steps

#### Step 1
Add the health check

```yaml
timeout: Define the maximum amount of time the system waits for a health check response from the service before considering it failed.
interval: Specify how often the health check is performed
unhealthy_threshold: Set the number of consecutive failed health checks required before marking the service as unhealthy.
healthy_threshold: Set the number of consecuative successful health checks needed to mark the services as healthy again after it was unhealthy.
even_log_path: The file path where health check events will be logged in for debugging and monitoring purposes.
http_health_check: Configure the details for HTTP-based health checks
```

#### Example code snippet: 
```yaml
health_checks:
- timeout: VALUE (in seconds - 's')
    interval: VALUE (in seconds - 's')
    unhealthy_threshold: VALUE
    healthy_threshold: VALUE
    event_log_path: "/VALUE"
    http_health_check:
        path: "/VALUE"
```

#### Hints
Exact values to be used in the '.yaml' file
```yaml
    event_log_path: "/var/log/envoy/order-service-health-check.log"
    http_health_check:
        path: "/health"
```

#### Step 2
Add the admin interface

Link to Envoy's documentation about Envoy admin interface - https://www.envoyproxy.io/docs/envoy/latest/start/quick-start/admin

```yaml
admin:
  access_log_path: "/dev/null"
  address:
    socket_address: { address: 0.0.0.0, port_value: 9901 }
```

Try out if the admin interface works for you, following the link:
```yaml
    http://localhost:9901/
```

!NB If you have changed the port value, you will also need to access your admin interface on the new desired one