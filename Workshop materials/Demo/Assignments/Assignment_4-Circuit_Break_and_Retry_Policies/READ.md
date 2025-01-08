# Assignment 4 - Instructions

Please make sure that your are following the general instructions of this workshop! - https://github.com/sebivenlo/esd-2024-envoy/blob/main/Workshop%20materials/Demo/Assignments/READ.md

Link to Envoy's documentation: https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/circuit_breaker.proto

### Steps

#### Step 1

The structure we used for circuit breaker: 
```yaml
    circuit_breakers:
    thresholds:
        - priority: VALUE
        max_connections: VALUE
        max_pending_requests: VALUE
        max_requests: VALUE
        max_retries: VALUE
```
You can find what are the default values that envoy gives them from the link on the top.

However, because of the scale of our workshop and demo in general, most of the values should be considerably lower than the default ones.

#### Step 2 

Change the values to the appropriate ones

