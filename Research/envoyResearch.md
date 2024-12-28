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
### 1.1. What are the advantages and challenges of microservice architectures?
Using microservices frameworks results in more scalable, flexible, and easier-to-maintain systems. Disadvantages include increased design complexity, debugging difficulties, testing complexity and deployment difficulties.
### 1.2. How do microservices communicate with each other (e.g., HTTP, gRPC, TCP)?
The most common method is of course RESTful APIs using HTTP/1.1, but many modern microservice architectures combine the above-mentioned methods. Rest is used for external APIs, while gRPC is used for internal service-to-service communication. Messaging Queues are sometimes used for decoupled or asynchronous tasks.
![gRPC Diagram](../Workshop%20materials/Presentation/Resources/gRPC%20Diagram.png)
### 1.3. What are the common patterns for service discovery in microservice architectures?
- A microservices-based application typically runs in virtualized or containerized environments. The number of instances of a service and its locations changes dynamically. We need to know where these instances are and their names to allow requests to arrive at the target microservice. This is where tactics such as Service Discovery come into play. The Service Discovery mechanism helps us know where each instance is located. In this way, a Service Discovery component acts as a registry in which the addresses of all instances are tracked.
- There are two main Service Discovery patterns: Client‑Side Discovery and Server‑Side Discovery.
- Client-Side Discovery: the Service Consumer is responsible for determining the network locations of available service instances and load balancing requests between them. The client queries the Service Register. Then the client uses a load-balancing algorithm to choose one of the available service instances and performs a request.
- Server-Side Discovery: uses an intermediary that acts as a Load Balancer. The client makes a request to a service via a load balancer that acts as an orchestrator. The load balancer queries the Service Registry and routes each request to an available service instance.
![Server-Side Discovery](../Workshop%20materials/Presentation/Resources/Service-Discovery-Server-Side.webp)
- Envoy is used in Server-Side Discovery, as a load-balancer, which is also involved in the service discovery process.

### 1.4. How does service-to-service authentication work in microservices?
- Service-to-Service Authentication is critical in microservice architectures to ensure secure communication between services and prevent unauthorized access.
- Envoy provides multiple ways to secure services, which include TLS/mTLS, JWT, OAuth2 and custom authorization filters.
- mTLS (Mutual TLS): Both client and server present certificates to authenticate each other. TLS encrypts communication after authentication.
- JWTs: Services include a JSON Web Token (JWT) in their requests. Envoy validates the JWT signature and claims using a public key or a JWKS endpoint.
- Custom filters: Envoy allows custom gRPC-based authorization checks to be performed before forwarding requests to the upstream service. This is useful for applying business-specific authentication logic.


## 2. Proxies & Load Balancing
### 2.1. What is a proxy, what types of proxies exist, and which ones are relevant for Envoy?
-	Forward Proxy: Acts on behalf of clients to send requests to servers.
-	Edge Proxy: A type of reverse proxy that operates at the boundary of a network (often at the "edge" of a cloud or enterprise network). It handles incoming traffic from external clients, serving as an API Gateway in many cases.
-	Sidecar Proxy: A lightweight proxy deployed alongside individual application instances, typically as part of a service mesh. It manages inter-service communication within a microservices architecture, providing load balancing, security and observability.
-	Envoy is primarily designed to function as both an edge proxy and a sidecar proxy, depending on the deployment scenario.

### 2.2. What are the key functions of a Layer 7 proxy?
### 2.3. How does Envoy perform load balancing (strategies like round-robin, least-request, etc.)?
### 2.4. How does Envoy compare to other popular proxies (like HAProxy, NGINX)?


## 3. Envoy-Specific Concepts
### 3.1. What is Envoy, and what problems does it solve in a microservice architecture?
Envoy Proxy is a modern, open-source, high performance, small footprint edge and service proxy. Envoy is most comparable to software load balancers such as NGINX and HAProxy. It is built to handle the complex networking challenges of modern microservice-based architectures. Originally written and deployed at Lyft, Envoy now has a vibrant contributor base and is an official Cloud Native Computing Foundation (CNCF) project. [1] CNCF - CNCF is the open source, vendor-neutral hub of cloud native computing, hosting projects like Kubernetes and Prometheus to make cloud native universal and sustainable. [2]

Envoy serves the purpose of a communication bus for microservices (refer to the picture below) across the cloud, enabling them to communicate with each other in a rapid, secure, and efficient manner. [3]
![Envoy-proxy-intercepting-traffic-between-services](https://github.com/user-attachments/assets/e3883361-95db-4b48-ae66-8f20861e76e9)

### 3.2. How does Envoy manage traffic routing between services?
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

### 3.3. How does Envoy handle resilience features such as circuit breaker and retry policies?

One of the biggest advantages of using Envoy in a service mesh is that it frees up services from implementing complex resiliency features like circuit breaking, outlier detection and retries that enable services to be resilient to realities such as rolling upgrades, dynamic infrastructure, and network failures. Having these features implemented at Envoy not only improves the availability and resiliency of services but also brings in consistency in terms of the behaviour and observability.

#### - Circuit Breaking
Circuit Breaking is a critical component of distributed systems. Circuit breaking lets applications configure failure thresholds that ensure safe maximums, allowing components to fail quickly and apply back pressure as soon as possible. Applying correct circuit breaking thresholds helps to save resources which otherwise are wasted in waiting for requests (timeouts) or retrying requests unnecessarily. One of the main advantages of the circuit breaking implementation in Envoy is that the circuit breaking limits are applied at the network level.

#### - Retries
Automatic request retries is another method of ensuring service resilience. Request retries should typically be used to guard against transient failures. Envoy supports very rich set of configurable parameters that dictate what type of requests are retried, how many times the request should be retried, timeouts for retries, etc.

#### - Retires in gRPC services
For gRPC services, Envoy looks at the gRPC status in the response and attempts a retry based on the statuses configured in x-envoy-retry-grpc-on.

The following application status codes in gRPC are considered safe for automatic retry.

- CANCELLED - Return this code if there is an error that can be retried in the service.

- RESOURCE_EXHAUSTED - Return this code if some of the resources that service depends on are exhausted in that instance so that retrying to another instance would help. Please note that for shared resource exhaustion, returning this will not help. Instead rate limiting should be used to handle such cases.

The HTTP Status codes 502 (Bad Gateway), 503 (Service Unavailable) and 504 (Gateway Timeout) are all mapped to gRPC status code UNAVAILABLE. This can also be considered safe for automatic retry.

The idempotency(a property of operations or API requests that ensures repeating the operation multiple times produces the same result as executing it once) of a request is an important consideration when configuring retries.

Envoy also supports extensions to its retry policies. The retry plugins allow you to customize the Envoy retry implementation to your application. [5]

#### - Outlier Detection
Outlier detection is a way of dynamically detecting misbehaving hosts in the upstream cluster. By detecting such hosts and ejecting them for a temporary period of time from the healthy load balancing set, Envoy can increase the success rate of a cluster. 

### 3.4. How does Envoy handle observability (metrics, logging, and tracing)?
#### Metrics - Envoy handles metrics data by default through its built-in statistics and metrics collection feature. Here’s how it works:
Statistics and metrics collection: Envoy collects various performance and operational metrics by default. These metrics include information about network traffic, request and response rates, error rates, and more. Envoy uses these metrics to monitor its behavior and performance.
Exposing metrics: Envoy provides an HTTP admin interface that exposes collected metrics in a format that can be scraped by monitoring systems like Prometheus. By default, metrics are available at the endpoint /stats/prometheus on the Envoy admin interface.
Metric types: Envoy collects different types of metrics, including counters (e.g., request count), gauges (e.g., current connections), and histograms (e.g., request duration distribution). These metrics provide detailed insights into the behavior of the proxy.
Custom metrics: Envoy also allows you to define custom metrics and statistics in the configuration file to capture specific application-level metrics or monitor aspects of Envoy’s behavior not covered by default metrics.
Integration with monitoring systems: You can configure Envoy to integrate with external monitoring and observability systems like Prometheus, Grafana, and StatsD to collect, store, and visualize metrics data.

#### Logging - Understanding what’s happening in your microservices also requires effective log management. Envoy Gateway handles logs by default through its access logging feature and sends logs to stdout in default text format. Here’s how it works:
Access logging: Envoy can be configured to generate access logs by default for incoming and outgoing requests. These logs capture information about each request, including details such as the request and response times, HTTP status codes, request headers, and more.
Log formats: Envoy allows you to define custom log formats, which specify what information should be included in the logs and in what format. You can configure the log format in the Envoy configuration file.
Log output: Envoy supports various log output targets, including writing logs to files, sending them to stdout, forwarding them to a syslog server, or even sending them to an HTTP server for remote log storage.
Filtering and sampling: Envoy provides options for filtering and sampling log data, so you can control which requests are logged and which are not. This can help reduce the volume of log data generated.
Security: Envoy’s access logs can also be configured to include security-related information, such as request and response headers, to aid in security monitoring and auditing.

#### Traces - Traces provide a chronological view of requests and are essential for debugging and performance optimization.
Generating trace data: Envoy generates trace data that records the journey of a request through the proxy. This includes start and end times, trace identifiers (Trace ID and Span ID), and service and operation names, among other information. This data is used to construct timelines and request paths.
Reporting trace data: Envoy can report trace data to backend tracing systems by default. Envoy supports the OpenTracing standard, so you can configure Envoy to send trace data to tracing systems that support OpenTracing. Additionally, Envoy supports the Zipkin format, allowing you to send trace data to a Zipkin tracing system.
Configuring trace data destinations: In the Envoy configuration file, you can define where trace data should be sent. This typically includes the tracing system’s address, port, and trace data format (Envoy Gateway currently only supports OpenTelemetry).
Enabling tracing: To enable tracing, you can add the appropriate configuration options in the Envoy configuration file to ensure Envoy starts generating and sending trace data. [6]

### 3.5. What is Envoy’s role in a service mesh (e.g., with Istio)?
What is a service mesh? - It is a dedicated infrastructure layer for managing service-to-service communication within a microservices architecture. It is typically implemented using a collection of interconnected proxy servers. The service mesh provides advanced traffic management features such as service discovery, load balancing, traffic shifting, and fault tolerance, among others. Can be seen in the diagram down below: 
![image](https://github.com/user-attachments/assets/39b83b54-5f99-46bd-8900-d9e0dec7791c)

Why using a service mesh? - For a big distributed architecture with 100’s of microservices, I need to

- Ensure reliable and fast communication between services
- Have high observability on requests through these service.
- In case of issues, being quickly able see what is failing and where
- Easily configure and change request routes.
- Have resilient communication practices in place, like circuit breaker , retry mechanism etc.

I need to code and build logic for these in each of the microservice or just use a service mesh which provides it out of the box.

Envoy's role in a service mesh. - Use case : We have a web application consisting of multiple microservices, each running in their own container.

We want to provide advanced load balancing and traffic management for these microservices.We deploy Envoy as a proxy server in front of each microservice. Envoy can now be configured to: 

-Handle incoming requests and route them to the appropriate microservice based on the request URL or other criteria.
-Discover the available microservices and their addresses: Envoy can use a service registry like Consul or etcd to discover the available microservices and their addresses. Envoy periodically polls the registry to keep its service discovery information up-to-date.
-Load balance the incoming requests across the available microservices. Envoy can use various load balancing strategies such as round-robin, least connections, or random.
-Perform health checks on each microservice instance to ensure it is available and healthy.
-Collect metrics on incoming requests, traffic patterns, and other performance indicators. Envoy can export these metrics to various monitoring systems like Prometheus, Datadog, or Grafana. [7]

### 3.6. How does Envoy support communication protocols (HTTP/1.x, HTTP/2, gRPC)?
#### gRPC
Bridging: 
Envoy supports multiple gRPC bridges:

grpc_http1_bridge filter which allows gRPC requests to be sent to Envoy over HTTP/1.1. Envoy then translates the requests to HTTP/2 or HTTP/3 for transport to the target server. The response is translated back to HTTP/1.1. When installed, the bridge filter gathers per RPC statistics in addition to the standard array of global HTTP statistics.

grpc_http1_reverse_bridge filter which allows gRPC requests to be sent to Envoy and then translated to HTTP/1.1 when sent to the upstream. The response is then converted back into gRPC when sent to the downstream. This filter can also optionally manage the gRPC frame header, allowing the upstream to not have to be gRPC aware at all.

connect_grpc_bridge filter which allows Connect requests to be sent to Envoy. Envoy then translates the requests to gRPC to be sent to the upstream. The response is converted back into the Connect protocol to be sent back to the downstream. HTTP/1.1 requests will be upgraded to HTTP/2 or HTTP/3 when needed.

Services:
In addition to proxying gRPC on the data plane, Envoy makes use of gRPC for its control plane, where it fetches configuration from management server(s) and in filters, such as for rate limiting or authorization checks. We refer to these as gRPC services.

When specifying gRPC services, it’s necessary to specify the use of either the Envoy gRPC client or the Google C++ gRPC client. We discuss the tradeoffs in this choice below.

The Envoy gRPC client is a minimal custom implementation of gRPC that makes use of Envoy’s HTTP/2 or HTTP/3 upstream connection management. Services are specified as regular Envoy clusters, with regular treatment of timeouts, retries, endpoint discovery/load balancing/failover/load reporting, circuit breaking, health checks, outlier detection. They share the same connection pooling mechanism as the Envoy data plane. Similarly, cluster statistics are available for gRPC services. Since the client is minimal, it does not include advanced gRPC features such as OAuth2 or gRPC-LB lookaside.

The Google C++ gRPC client is based on the reference implementation of gRPC provided by Google at https://github.com/grpc/grpc. It provides advanced gRPC features that are missing in the Envoy gRPC client. The Google C++ gRPC client performs its own load balancing, retries, timeouts, endpoint management, etc, independent of Envoy’s cluster management. The Google C++ gRPC client also supports custom authentication plugins.

It is recommended to use the Envoy gRPC client in most cases, where the advanced features in the Google C++ gRPC client are not required. This provides configuration and monitoring simplicity. Where necessary features are missing in the Envoy gRPC client, the Google C++ gRPC client should be used instead. [8]

#### HTTP
##### HTTP protocols
Envoy’s HTTP connection manager has native support for HTTP/1.1, HTTP/2 and HTTP/3, including WebSockets.

Envoy’s HTTP support was designed to first and foremost be an HTTP/2 multiplexing proxy. Internally, HTTP/2 terminology is used to describe system components. For example, an HTTP request and response take place on a “stream”.

A codec API is used to translate from different wire protocols into a protocol agnostic form for streams, requests, responses, etc.

##### HTTP lifecycle
Proxying of the request begins when the downstream HTTP codec has successfully decoded request header map.

The point at which the proxying completes and the stream is destroyed depends on the upstream protocol and whether independent half close is enabled.

If independent half-close is enabled and the upstream protocol is either HTTP/2 or HTTP/3 protocols the stream is destroyed after both request and response are complete i.e. reach their respective end-of-stream, by receiving trailers or the header/body with end-stream set in both directions AND response has success (2xx) status code.

For HTTP/1 upstream protocol or if independent half-close is disabled the stream is destroyed when the response is complete and reaches its end-of-stream, i.e. when trailers or the response header/body with end-stream set are received, even if the request has not yet completed. If the request was incomplete at response completion, the stream is reset.

Note that proxying can stop early when an error or timeout occurred or when a peer reset HTTP/2 or HTTP/3 stream.

##### Route table configuration
Each HTTP connection manager filter has an associated route table, which can be specified in one of two ways:

- Statically.
- Dynamically via the RDS API.

##### Timeouts
Various configurable timeouts apply to an HTTP connection and its constituent streams. Please see this FAQ entry for an overview of important timeout configuration. [9]


## 4. Security
### 4.1. What are the security implications of using a reverse proxy?
### 4.2. How does Envoy handle TLS termination and mutual TLS (mTLS)?
### 4.3. How can Envoy enforce authentication and authorization policies?


## 5. Configuration & Deployment
### 5.1. How is Envoy typically deployed (sidecar pattern, standalone)?
### 5.2. What is the structure of Envoy’s configuration file?
### 5.3. How does dynamic configuration and control plane interaction work in Envoy (e.g., xDS APIs)?
### 5.4. How does Envoy integrate with orchestration systems like Kubernetes?


## 6. Performance and Optimization
### 6.1. What are the performance considerations when using Envoy in a high-traffic environment?
### 6.2. How does Envoy’s performance compare to other reverse proxies in terms of latency and throughput?
