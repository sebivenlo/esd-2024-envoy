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
### 1.1. What are the advantages and disadvantages of the microservices architecture?
Microservices architecture is an approach to system design that breaks complex systems into more minor, more manageable services. Using microservices frameworks results in more scalable, flexible, and easier-to-maintain systems. Applications built using this architecture consist of small, independently deployable services that communicate with each other through APIs. By breaking down complex systems into more minor services, microservices architecture provides improved scalability, flexibility, and maintenance simplicity.

#### Advantages

**1. Accelerate scalability**: DevOps teams seamlessly introduce new components without causing any downtime, thanks to the independent operation of each service within the microservices architecture. They can choose each service's best language or technology without compatibility concerns. Deploying services across multiple servers can mitigate the performance impact of individual components and help companies avoid vendor lock-in.
**2. Improve fault isolation**: Microservices architecture is compartmentalized — if one service encounters a fault or failure, it doesn’t propagate across the entire system.
**3. Enhance team productivity**: Microservices architecture allows small, focused teams to concentrate on a particular service’s development, deployment, and maintenance without being burdened by the complexities of the entire system. Microservices architecture fosters a sense of ownership and expertise within teams, enabling specialized team members to make informed decisions, iterate quickly, and maintain a high quality of service within their domain.
**4. Quicker deployment time**: In monolithic architectures, changing necessitates redeploying the entire application. Microservices architecture enables faster releases because each service evolves and deploys independently, reducing the risk and time associated with coordinating changes across an entire application. Decoupling services in this manner enhances agility. You can swiftly roll out updates or fixes with minimal disruption to the overall system.
**5. Increase Cost-efficiency**: Microservices architecture optimizes resource allocation and maintenance because teams work on small, well-defined services. Efforts are localized to specific services, reducing overall development and system maintenance costs. Teams focus on specific functionality, ensuring resources are used efficiently without redundancy or excess capacity.


#### Disadvantages

**1. Increased complexity**: Because microservices are distributed, managing service communication can be challenging. Developers may have to write extra code to ensure smooth communication between modules.
**2. Deployment and versioning challenges**: Coordinating deployments and managing version control across multiple services can be complex, leading to compatibility issues.
**3. Testing complexity**: Testing microservices involves complex scenarios, mainly when conducting integration testing across various services. Orchestrating this task can be challenging.
**4. Debugging difficulties**: It can be demanding to debug an application that contains multiple microservices, each with its own set of logs. A single business process can run across multiple machines simultaneously, compounding complexity.
**5. Data management challenges**: Data consistency and transactions across multiple services can be complex. Microservices architecture calls for careful data management and coordination to support data integrity.

![Microservices Architecture](../Workshop%20materials/Presentation/Resources/Microservice_Architecture.png)

### 1.2. How do microservices communicate with each other (e.g., HTTP, gRPC, TCP)?
- **HTTP/1.1**: HTTP is a top-level application protocol that exchanges information between a client computer and a local or remote web server. In this process, a client sends a text-based request to a server by calling a method like GET or POST. In response, the server sends a resource like an HTML page back to the client. HTTP/1.1, introduced in 1997, enhanced the original HTTP protocol by enabling persistent connections, allowing multiple requests and responses over a single connection, and introducing chunked transfer encoding to support dynamically generated content.
- **HTTP/2**: HTTP/2, standardized in 2015, brought significant performance improvements through features like multiplexing, which allows multiple requests and responses to be sent concurrently over a single connection, reducing latency and improving page load times. Additionally, HTTP/2 uses a binary protocol instead of the textual format of HTTP/1.1, enhancing parsing efficiency and robustness. It also introduced header compression to decrease overhead and server push capabilities to proactively send resources to clients before they are requested.<a>[33]</a> From a technical point of view, one of the most significant features that distinguishes HTTP/1.1 and HTTP/2 is the binary framing layer, which can be thought of as a part of the application layer in the internet protocol stack. As opposed to HTTP/1.1, which keeps all requests and responses in plain text format, HTTP/2 uses the binary framing layer to encapsulate all messages in binary format, while still maintaining HTTP semantics, such as verbs, methods, and headers. An application level API would still create messages in the conventional HTTP formats, but the underlying layer would then convert these messages into binary. This ensures that web applications created before HTTP/2 can continue functioning as normal when interacting with the new protocol. The conversion of messages into binary allows HTTP/2 to try new approaches to data delivery not available in HTTP/1.1, a contrast that is at the root of the practical differences between the two protocols.<a>[34]</a>
- **What is gRPC**: It is the most popular implementation of the RPC (Remote Procedure Call) concept. It is based on HTTP/2, although it is not supported by default on any browsers, so it is used mostly for communication between microservices. In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. As in many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types. On the server side, the server implements this interface and runs a gRPC server to handle client calls. On the client side, the client has a stub (referred to as just a client in some languages) that provides the same methods as the server.
![gRPC Diagram](../Workshop%20materials/Presentation/Resources/gRPC%20Server-Stub.svg)

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
- mTLS (Mutual TLS): Mutual TLS, or mTLS for short, is a method for mutual authentication. mTLS ensures that the parties at each end of a network connection are who they claim to be by verifying that they both have the correct private key. The information within their respective TLS certificates provides additional verification. mTLS is often used in a Zero Trust security framework* to verify users, devices, and servers within an organization. It can also help keep APIs secure<.

*Zero Trust means that no user, device, or network traffic is trusted by default, an approach that helps eliminate many security vulnerabilities.
![mTSL](../Workshop%20materials/Presentation/Resources/mTSL.png)
- JWTs: Services include a JSON Web Token (JWT) in their requests. Envoy validates the JWT signature and claims using a public key or a JWKS endpoint.
- Custom filters: Envoy allows custom gRPC-based authorization checks to be performed before forwarding requests to the upstream service. This is useful for applying business-specific authentication logic.


## 2. Proxies & Load Balancing
### 2.1. What is a proxy, what types of proxies exist, and which ones are relevant for Envoy?
-	Forward Proxy: a forward proxy is a client-side intermediary used to control and monitor outbound requests from applications or users within a private network to external systems, such as APIs or web servers. It plays a significant role in enforcing access control, logging traffic, caching data for improved performance, and anonymizing requests by masking client identities. For example, can be configured to enforce internet usage policies or optimize API call efficiency in large-scale systems. In simple terms, it acts on behalf of clients to send requests to servers.
-	Edge Proxy: A type of reverse proxy that operates at the boundary of a network (often at the "edge" of a cloud or enterprise network). It is a server-side intermediary responsible for managing inbound client requests to backend services. Edge proxies are utilized to handle critical concerns like load balancing, authentication, SSL termination, and request routing. By abstracting these functions from backend servers, edge proxies enhance scalability, security, and maintainability. They are an essential component in distributed systems and microservices, ensuring high availability and robust handling of client traffic. They can also serve as API Gateways in many cases.
-	Sidecar Proxy: A sidecar proxy is closely associated with service mesh architectures in microservices, where it runs alongside an application instance as a separate process or container. Sidecar proxies are responsible for service discovery, traffic routing, security enforcement (e.g., mutual TLS), and telemetry collection. Using sidecar proxies allows decoupleing these concerns from application code, enabling a standardized way to implement cross-cutting functionalities across services. Sidecar proxies are pivotal in improving observability, resilience, and maintainability in microservices-based applications.
![Sidecar Proxy Design Pattern Diagram](../Workshop%20materials/Presentation/Resources/Sidecar%20Proxy%20Diagram.png)
-	Envoy is primarily designed to function as both an edge proxy and a sidecar proxy, depending on the deployment scenario.

### 2.2. What are the key functions of a Layer 7 proxy?
Layer 7 proxies, like Envoy, operate at the application layer, offering advanced features not possible with Layer 3/4 proxies, which work only with transport-layer data like IP addresses and ports. Layer 7 proxies can inspect and manipulate application data (e.g., HTTP headers, paths, cookies), enabling intelligent traffic routing, caching, and security enforcement. For example, they can route specific API requests to different backends, cache frequently accessed content, terminate TLS connections, and enforce authentication or authorization policies such as validating JWT tokens. These proxies also implement sophisticated load-balancing strategies, such as round-robin, least-connections, or weight-based routing, often based on real-time application metrics.

Additionally, Layer 7 proxies integrate with service discovery systems, dynamically routing traffic to healthy and available endpoints, and provide detailed observability through metrics, logging, and distributed tracing. They also enhance system resilience by enabling retries, timeouts, and circuit breakers. While these features provide granular control and improve performance in microservice architectures, Layer 7 proxies are more resource-intensive, as they require more processing power to inspect application data. In contrast, Layer 3/4 proxies, which simply route traffic based on IP and port, are faster and more efficient but lack application-layer awareness.

### 2.3. How does Envoy perform load balancing (strategies like round-robin, least-request, etc.)?

#### Load Balancing
Load balancing is the process of distributing network traffic across multiple backend servers to ensure reliability, scalability, and optimal utilization of resources. In a microservices architecture, it is essential because services often need to handle large volumes of traffic while maintaining low latency and high availability. Multiple instances of the same microservice are deployed to manage this load, and a load balancer ensures that requests are evenly distributed among them. Envoy, as a modern proxy, supports several load-balancing strategies tailored for various use cases, including round-robin, least-request, random, ring hashing, Maglev, and weighted load balancing.
![Load Balancing](../Workshop%20materials/Presentation/Resources/Load-Balancing.jpg)

#### Load Balancing Strategies

**Round-Robin**: It sequentially distributes requests to each server in the backend in a looping fashion. This strategy is simple to implement and effective when all servers have similar capacity. However, it does not account for differences in server load, which can lead to performance bottlenecks if some requests are more resource-intensive than others.

**Least-Request**: This strategy routes traffic to the server with the fewest active requests. It ensures an even workload distribution and is particularly effective in environments where request processing times vary significantly. However, its implementation requires real-time monitoring of server loads, which adds complexity to the system.

**Random**: This strategy randomly selects a server to handle each incoming request. It is straightforward and fair over time, as all servers receive approximately the same number of requests in the long run. However, because it does not consider server load or request type, it can lead to uneven distribution in the short term, especially with small server pools.

**Ring Hashing**: This strategy uses consistent hashing to route requests, ensuring that a client consistently communicates with the same server, which is useful for maintaining session affinity. Ring hashing minimizes disruption when servers are added or removed. However, it can lead to imbalanced traffic distribution if the hash space is unevenly divided among servers.

**Maglev**: Maglev is a hashing-based strategy that provides uniform traffic distribution and minimizes rebalancing when backend servers are added or removed. It is highly efficient for high-traffic environments and excels in reducing disruptions during server scaling. However, it is more complex to implement and may require specific tuning to achieve optimal performance.

**Weighted Load Balancing**: This strategy assigns weights to servers, directing more traffic to servers with higher capacity or preference. It is particularly beneficial in heterogeneous environments where servers have varying capabilities or for geographically distributed traffic. Its primary drawback is the need for manual weight configuration, which can become challenging in dynamic or large-scale environments.

### 2.4. How does Envoy compare to other popular proxies (like HAProxy, NGINX)?
Envoy, HAProxy, NGINX, Traefik, and Amazon Application Load Balancer (ALB) each offer unique capabilities, making them suited for different scenarios in networking and service management. Envoy is a modern proxy designed specifically for microservice architectures. Its focus is on advanced observability, dynamic service discovery, resilience (with features like circuit breaking and retries), and extensibility through APIs. Envoy is also a core component of service meshes like Istio, making it ideal for highly dynamic and distributed systems.

HAProxy, in contrast, is celebrated for its raw performance and reliability, excelling in TCP and HTTP load balancing. It's widely used in scenarios requiring extremely high throughput and low latency, offering an efficient and lightweight solution. NGINX, while initially developed as a high-performance web server, has become a versatile reverse proxy and load balancer. It is particularly popular for serving HTTP content and managing web traffic but is not as feature-rich as Envoy in dynamic microservice environments.

Traefik is designed with microservices in mind, specifically targeting containerized applications and orchestration platforms like Kubernetes. It automatically discovers services and adapts to changes in the infrastructure dynamically. Traefik is less focused on raw performance and more on simplifying configuration and operation in cloud-native environments.

Amazon Application Load Balancer (ALB), while not a full proxy in the traditional sense, operates as an elastic load balancing service integrated into AWS. It offers Layer 7 capabilities, including content-based routing and SSL termination, but lacks the deep programmability and observability features of standalone proxies like Envoy or HAProxy. ALB is most advantageous for users deeply integrated into the AWS ecosystem, providing seamless scaling and integration with AWS services at the cost of less configurability and portability.

Each solution addresses specific needs, with Envoy and Traefik excelling in microservice and cloud-native setups, HAProxy and NGINX offering performance and flexibility for traditional workloads, and ALB providing a managed, cloud-centric option for AWS users.

![ProXy Comparison Table](../Workshop%20materials/Presentation/Resources/Proxy%20Comparison.png)

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
- Exposure of Proxy: The reverse proxy becomes a single entry point, making it a potential target for attacks like DDoS or exploitation of vulnerabilities in the proxy software.
-Data Interception: Improper configuration of SSL/TLS can expose sensitive data, as the reverse proxy often decrypts and re-encrypts traffic.
-Misconfiguration Risks: Errors in routing, authentication, or access control policies can lead to unauthorized access or data leaks.
-Added Attack Surface: Features like API gateway capabilities, rate limiting, and logging can increase complexity and surface for exploitation if not secured.
-Dependency on Proxy: If compromised, the proxy can impact all upstream services it protects or routes to.

However, with envoy, the security risks are mitigated by robust support for mTLS, rate limiting, request validation, and rich observability. However, proper configuration, regular updates, and monitoring are critical to maintaining its security posture. [10]

### 4.2. How does Envoy handle TLS termination and mutual TLS (mTLS)?
What is mTLS - Mutual TLS, or mTLS for short, is a method for mutual authentication. mTLS ensures that the parties at each end of a network connection are who they claim to be by verifying that they both have the correct private key. The information within their respective TLS certificates provides additional verification. mTLS is often used in a Zero Trust security framework* to verify users, devices, and servers within an organization. [11]

#### TSL termination:
1.Incoming Connection Termination: Envoy acts as the endpoint for client connections by terminating the TLS session. This involves:
-Decrypting traffic using the server certificate and private key.
-Configuring TLS settings like supported protocols (e.g., TLS 1.2, 1.3) and cipher suites.
2.Configuration: You can specify the TLS certificates and private keys in the tls_context of a listener.
3.Re-encryption (Optional): After termination, Envoy can re-establish a secure TLS connection to the upstream service if needed.

#### Mutual TLS (mLTS): 
1.Client Authentication: Envoy supports mTLS by verifying the client certificate during the handshake process.
2.Trust Validation:
-Envoy uses a Certificate Authority (CA) certificate bundle to validate the client's certificate.
-The client's certificate must meet criteria such as validity, signing authority, and (optionally) specific Subject Alternative Names (SANs).
3.Configuration:
-mTLS is set up using the require_client_certificate field in the listener's tls_context.
-Trusted CA certificates are specified in the validation_context.
[12]

### 4.3. How can Envoy enforce authentication and authorization policies?
#### Authentication in Envoy typically involves verifying the identity of a request, either by checking credentials (e.g., tokens, certificates) or integrating with an external Identity Provider (IdP).

Filtering users:
#### JWT Authentication Filter:
-Validates JSON Web Tokens (JWT) presented in the request headers or cookies.
-Configured to check for token validity (signature, issuer, audience, expiry, etc.).
-Supports integration with OAuth2 and OpenID Connect workflows.
#### mTLS Authentication:
-Mutual TLS (mTLS) can be enforced using Envoy’s transport socket configuration.
-Validates client certificates against a trusted Certificate Authority (CA). [13]

#### Authorization: 
#### RBAC (Role-Based Access Control) Filter:
-Implements fine-grained access control based on roles, actions, or resource attributes.
-Rules can use dynamic metadata from JWT claims, headers, or other sources.
#### External Authorization Filter:
-Delegates authorization decisions to an external service (e.g., OPA, custom authz service).
-Communicates over gRPC to fetch allow/deny decisions based on the request context.

#### Why use Envoy for Authentication and Authorization?
-Centralized Policy Enforcement: Consistently applies policies across multiple microservices.
-Scalability: Offloads authentication/authorization to Envoy to keep downstream services simple.
-Extensibility: Supports custom logic via external authorization services.
-Compliance: Ensures compliance with security and access policies.

## 5. Configuration & Deployment
### 5.1. How is Envoy typically deployed (sidecar pattern, standalone)?
### 5.2. What is the structure of Envoy’s configuration file?
### 5.3. How does dynamic configuration and control plane interaction work in Envoy (e.g., xDS APIs)?
### 5.4. How does Envoy integrate with orchestration systems like Kubernetes?


## 6. Performance & Optimization
### 6.1. What are the performance considerations when using Envoy in a high-traffic environment?
#### Best practices for benchmarking Envoy: 
There is no single QPS, latency or throughput overhead that can characterize a network proxy such as Envoy. Instead, any measurements need to be contextually aware, ensuring an apples-to-apples comparison with other systems by configuring and load testing Envoy appropriately. As a result, we can’t provide a canonical benchmark configuration, but instead offer the following guidance:
-A release Envoy binary should be used. If building, please ensure that -c opt is used on the Bazel command line. When consuming Envoy point releases, make sure you are using the latest point release; given the pace of Envoy development it’s not reasonable to pick older versions when making a statement about Envoy performance. Similarly, if working on a main build, please perform due diligence and ensure no regressions or performance improvements have landed proximal to your benchmark work and that your are close to HEAD.
-The --concurrency Envoy CLI flag should be unset (providing one worker thread per logical core on your machine) or set to match the number of cores/threads made available to other network proxies in your comparison.
-Disable circuit breaking. A common issue during benchmarking is that Envoy’s default circuit breaker limits are low, leading to connection and request queuing.
-Disable generate_request_id.
-Disable dynamic_stats. If you are measuring the overhead vs. a direct connection, you might want to consider disabling all stats via reject_all.
-Ensure that the networking and HTTP filter chains are reflective of comparable features in the systems that Envoy is being compared with.
-Ensure that TLS settings (if any) are realistic and that consistent cyphers are used in any comparison. Session reuse may have a significant impact on results and should be tracked via listener SSL stats.
-Ensure that HTTP/2 settings, in particular those that affect flow control and stream concurrency, are consistent in any comparison. Ideally taking into account BDP and network link latencies when optimizing any HTTP/2 settings.
-Verify in the listener and cluster stats that the number of streams, connections and errors matches what is expected in any given experiment.
-Make sure you are aware of how connections created by your load generator are distributed across Envoy worker threads. This is especially important for benchmarks that use low connection counts and perfect keep-alive. You should be aware that Envoy will allocate all streams for a given connection to a single worker thread. This means, for example, that if you have 72 logical cores and worker threads, but only a single HTTP/2 connection from your load generator, then only 1 worker thread will be active.
-Make sure request-release timing expectations line up with what is intended. Some load generators produce naturally jittery and/or batchy timings. This might end up being an unintended dominant factor in certain tests.
-The specifics of how your load generator reuses connections is an important factor (e.g. MRU, random, LRU, etc.) as this impacts work distribution.
-If you’re trying to measure small (say < 1ms) latencies, make sure the measurement tool and environment have the required sensitivity and the noise floor is sufficiently low.
-Be critical of your bootstrap or xDS configuration. Ideally every line has a motivation and is necessary for the benchmark under consideration.
-Consider using Nighthawk as your load generator and measurement tool. We are committed to building out benchmarking and latency measurement best practices in this tool.
-Examine perf profiles of Envoy during the benchmark run, e.g. with flame graphs. Verify that Envoy is spending its time doing the expected essential work under test, rather than some unrelated or tangential work.
-Familiarize yourself with latency measurement best practices. In particular, never measure latency at max load, this is not generally meaningful or reflecting of real system performance; aim to measure below the knee of the QPS-latency curve. Prefer open vs. closed loop load generators.
#### NB! Using a Flame graph, we can find where the bottle neck lies [14] , example: [15]  
### 6.2. How does Envoy’s performance compare to other reverse proxies in terms of latency and throughput?
https://www.loggly.com/blog/benchmarking-5-popular-load-balancers-nginx-haproxy-envoy-traefik-and-alb/ - to be finished off
