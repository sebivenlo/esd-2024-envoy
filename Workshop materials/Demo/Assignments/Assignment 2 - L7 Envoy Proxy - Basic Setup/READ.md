# Assignment 2 - Instructions

### Steps
#### Step 1
Create the different routes:

Example, creating a value service
```yaml
        # Route to a Value Service - MOCK
        - match: { prefix: "/VALUE" }
        route: 
            cluster: value_service
            prefix_rewrite: "/"
```

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