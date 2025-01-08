# Assignment 2 - Instructions

Please make sure that your are following the general instructions of this workshop! - https://github.com/sebivenlo/esd-2024-envoy/blob/main/Workshop%20materials/Demo/Assignments/READ.md

### Steps

#### Step 1
Create the different routes:

Example, creating a value service:
```yaml
        # Route to a Value Service - MOCK
        - match: { prefix: "/VALUE" }
        route: 
            cluster: value_service
            prefix_rewrite: "/"
```
Do not change the 'prefix_rewrite' attribute.
#### Step 2
Add the http filters

Link to the documentation: https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/router/v3/router.proto

Format of the http filters:
```yaml
    http_filters:
        - name: NAME
            typed_config:
                "@type": TYPE
```