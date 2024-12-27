# Envoy Research

## Research Questions
In this section, important research questions will be asked and answered. This will help with a deeper understanding of how computer networking works from the eyes of a software engineer and, in turn, help with the understanding of what Envoy is and how it works.

- What is microservice architecture?
- How does an API request usually work?
- What was the OSI model, and is it relevant here?
- What are ports, and how do they work?
- What is a proxy?
- What is the difference between a proxy and a reverse-proxy?
- What is network balancing, and when and how is it used?

## 1. Microservices & Networking
- What are the advantages and challenges of microservice architectures?
- How do microservices communicate with each other (e.g., HTTP, gRPC, TCP)?
- What are the common patterns for service discovery in microservice architectures?
- How does service-to-service authentication work in microservices?

## 2. Proxies & Load Balancing
- What are the key functions of a Layer 7 proxy?
- How does Envoy perform load balancing (strategies like round-robin, least-request, etc.)?
- How does Envoy compare to other popular proxies (like HAProxy, NGINX)?

## 3. Envoy-Specific Concepts
### 3.1 - What is Envoy, and what problems does it solve in a microservice architecture?
Envoy Proxy is a modern, open-source, high performance, small footprint edge and service proxy. Envoy is most comparable to software load balancers such as NGINX and HAProxy. It is built to handle the complex networking challenges of modern microservice-based architectures. Originally written and deployed at Lyft, Envoy now has a vibrant contributor base and is an official Cloud Native Computing Foundation (CNCF) project. [1] CNCF - CNCF is the open source, vendor-neutral hub of cloud native computing, hosting projects like Kubernetes and Prometheus to make cloud native universal and sustainable. [2]

Envoy serves the purpose of a communication bus for microservices (refer to the picture below) across the cloud, enabling them to communicate with each other in a rapid, secure, and efficient manner. [3]
![Envoy-proxy-intercepting-traffic-between-services](https://github.com/user-attachments/assets/e3883361-95db-4b48-ae66-8f20861e76e9)

### 3.2 - How does Envoy manage traffic routing between services?
Envoy’s router can split traffic to a route in a virtual host across two or more upstream clusters. There are two common use cases.

1. Version upgrades: traffic to a route is shifted gradually from one cluster to another. 

The runtime object in the route configuration determines the probability of selecting a particular route (and hence its cluster). By using the runtime_fraction configuration, traffic to a particular route in a virtual host can be gradually shifted from one cluster to another. Consider the following example configuration, where two versions helloworld_v1 and helloworld_v2 of a service named helloworld are declared in the envoy configuration file.

![image](https://github.com/user-attachments/assets/244404de-d3b7-4189-8ea5-af94562ba00d)

If the route has a runtime_fraction object, the request will be additionally matched based on the runtime_fraction value (or the default, if no value is specified). Thus, by placing routes back-to-back in the above example and specifying a runtime_fraction object in the first route, traffic shifting can be accomplished by changing the runtime_fraction value. The following are the approximate sequence of actions required to accomplish the task.

In the beginning, set routing.traffic_shift.helloworld to 100, so that all requests to the helloworld virtual host would match with the v1 route and be served by the helloworld_v1 cluster.

To start shifting traffic to helloworld_v2 cluster, set routing.traffic_shift.helloworld to values 0 < x < 100. For instance at 90, 1 out of every 10 requests to the helloworld virtual host will not match the v1 route and will fall through to the v2 route.

Gradually decrease the value set in routing.traffic_shift.helloworld so that a larger percentage of requests match the v2 route.

When routing.traffic_shift.helloworld is set to 0, no requests to the helloworld virtual host will match to the v1 route. All traffic would now fall through to the v2 route and be served by the helloworld_v2 cluster.

2. A/B testing or multivariate testing: two or more versions of the same service are tested simultaneously. The traffic to the route has to be split between clusters running different versions of the same service. 

Consider the helloworld example again, now with three versions (v1, v2 and v3) instead of two. To split traffic evenly across the three versions (i.e., 33%, 33%, 34%), the weighted_clusters option can be used to specify the weight for each upstream cluster.

The weighted_clusters configuration block in a route can be used to specify multiple upstream clusters along with weights that indicate the percentage of traffic to be sent to each upstream cluster.

![image](https://github.com/user-attachments/assets/b2fac5ae-d610-4aed-a4f1-b866cd700117)

The sum of the weights needs to be greater than 0. In the V2 API, the total weight defaults to 100, but can be modified to allow finer granularity. The total weight is now deprecated, and the relative value of each cluster weight compared to the sum of all cluster weights will be used.

The weights assigned to each cluster can be dynamically adjusted using the following runtime variables: routing.traffic_split.helloworld.helloworld_v1, routing.traffic_split.helloworld.helloworld_v2 and routing.traffic_split.helloworld.helloworld_v3. [4]

### 3.3 - How does Envoy handle resilience features such as circuit breaker and retry policies?

One of the biggest advantages of using Envoy in a service mesh is that it frees up services from implementing complex resiliency features like circuit breaking, outlier detection and retries that enable services to be resilient to realities such as rolling upgrades, dynamic infrastructure, and network failures. Having these features implemented at Envoy not only improves the availability and resiliency of services but also brings in consistency in terms of the behaviour and observability.

### - Circuit Breaking
Circuit Breaking is a critical component of distributed systems. Circuit breaking lets applications configure failure thresholds that ensure safe maximums, allowing components to fail quickly and apply back pressure as soon as possible. Applying correct circuit breaking thresholds helps to save resources which otherwise are wasted in waiting for requests (timeouts) or retrying requests unnecessarily. One of the main advantages of the circuit breaking implementation in Envoy is that the circuit breaking limits are applied at the network level.

### - Retries
Automatic request retries is another method of ensuring service resilience. Request retries should typically be used to guard against transient failures. Envoy supports very rich set of configurable parameters that dictate what type of requests are retried, how many times the request should be retried, timeouts for retries, etc.

### - Retires in gRPC services
For gRPC services, Envoy looks at the gRPC status in the response and attempts a retry based on the statuses configured in x-envoy-retry-grpc-on.

The following application status codes in gRPC are considered safe for automatic retry.

- CANCELLED - Return this code if there is an error that can be retried in the service.

- RESOURCE_EXHAUSTED - Return this code if some of the resources that service depends on are exhausted in that instance so that retrying to another instance would help. Please note that for shared resource exhaustion, returning this will not help. Instead rate limiting should be used to handle such cases.

The HTTP Status codes 502 (Bad Gateway), 503 (Service Unavailable) and 504 (Gateway Timeout) are all mapped to gRPC status code UNAVAILABLE. This can also be considered safe for automatic retry.

The idempotency(a property of operations or API requests that ensures repeating the operation multiple times produces the same result as executing it once) of a request is an important consideration when configuring retries.

Envoy also supports extensions to its retry policies. The retry plugins allow you to customize the Envoy retry implementation to your application. [5]

### - Outlier Detection
Outlier detection is a way of dynamically detecting misbehaving hosts in the upstream cluster. By detecting such hosts and ejecting them for a temporary period of time from the healthy load balancing set, Envoy can increase the success rate of a cluster. 

### 3.4 - How does Envoy handle observability (metrics, logging, and tracing)?
### Metrics - Envoy handles metrics data by default through its built-in statistics and metrics collection feature. Here’s how it works:
Statistics and metrics collection: Envoy collects various performance and operational metrics by default. These metrics include information about network traffic, request and response rates, error rates, and more. Envoy uses these metrics to monitor its behavior and performance.
Exposing metrics: Envoy provides an HTTP admin interface that exposes collected metrics in a format that can be scraped by monitoring systems like Prometheus. By default, metrics are available at the endpoint /stats/prometheus on the Envoy admin interface.
Metric types: Envoy collects different types of metrics, including counters (e.g., request count), gauges (e.g., current connections), and histograms (e.g., request duration distribution). These metrics provide detailed insights into the behavior of the proxy.
Custom metrics: Envoy also allows you to define custom metrics and statistics in the configuration file to capture specific application-level metrics or monitor aspects of Envoy’s behavior not covered by default metrics.
Integration with monitoring systems: You can configure Envoy to integrate with external monitoring and observability systems like Prometheus, Grafana, and StatsD to collect, store, and visualize metrics data.

### Logging - Understanding what’s happening in your microservices also requires effective log management. Envoy Gateway handles logs by default through its access logging feature and sends logs to stdout in default text format. Here’s how it works:
Access logging: Envoy can be configured to generate access logs by default for incoming and outgoing requests. These logs capture information about each request, including details such as the request and response times, HTTP status codes, request headers, and more.
Log formats: Envoy allows you to define custom log formats, which specify what information should be included in the logs and in what format. You can configure the log format in the Envoy configuration file.
Log output: Envoy supports various log output targets, including writing logs to files, sending them to stdout, forwarding them to a syslog server, or even sending them to an HTTP server for remote log storage.
Filtering and sampling: Envoy provides options for filtering and sampling log data, so you can control which requests are logged and which are not. This can help reduce the volume of log data generated.
Security: Envoy’s access logs can also be configured to include security-related information, such as request and response headers, to aid in security monitoring and auditing.

### Traces - Traces provide a chronological view of requests and are essential for debugging and performance optimization.
Generating trace data: Envoy generates trace data that records the journey of a request through the proxy. This includes start and end times, trace identifiers (Trace ID and Span ID), and service and operation names, among other information. This data is used to construct timelines and request paths.
Reporting trace data: Envoy can report trace data to backend tracing systems by default. Envoy supports the OpenTracing standard, so you can configure Envoy to send trace data to tracing systems that support OpenTracing. Additionally, Envoy supports the Zipkin format, allowing you to send trace data to a Zipkin tracing system.
Configuring trace data destinations: In the Envoy configuration file, you can define where trace data should be sent. This typically includes the tracing system’s address, port, and trace data format (Envoy Gateway currently only supports OpenTelemetry).
Enabling tracing: To enable tracing, you can add the appropriate configuration options in the Envoy configuration file to ensure Envoy starts generating and sending trace data. [6]

### 3.5 - What is Envoy’s role in a service mesh (e.g., with Istio)?

### 3.6 - How does Envoy support communication protocols (HTTP/1.x, HTTP/2, gRPC)?

## 4. Security
### 4.1 - What are the security implications of using a reverse proxy?
### 4.2 - How does Envoy handle TLS termination and mutual TLS (mTLS)?
### 4.3 - How can Envoy enforce authentication and authorization policies?

## 5. Configuration & Deployment
- How is Envoy typically deployed (sidecar pattern, standalone)?
- What is the structure of Envoy’s configuration file?
- How does dynamic configuration and control plane interaction work in Envoy (e.g., xDS APIs)?
- How does Envoy integrate with orchestration systems like Kubernetes?

## 6. Performance and Optimization
### 6.1 - What are the performance considerations when using Envoy in a high-traffic environment?
### 6.2 - How does Envoy’s performance compare to other reverse proxies in terms of latency and throughput?
