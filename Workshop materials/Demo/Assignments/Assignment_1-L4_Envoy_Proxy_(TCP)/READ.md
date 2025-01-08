# Assignment 1 - Instructions

Please make sure that your are following the general instructions of this workshop! - https://github.com/sebivenlo/esd-2024-envoy/blob/main/Workshop%20materials/Demo/Assignments/READ.md

### Configure the filter for a Layer 4 proxy

Link to Envoy's documentation about TCP Proxy - 
https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/network/tcp_proxy/v3/tcp_proxy.proto#envoy-v3-api-msg-extensions-filters-network-tcp-proxy-v3-tcpproxy

### Steps

#### Step 1
Specify the name of the filter you want to use. In the case of a Layer 4 proxing, you need the "tcp_proxy" filter.

#### Step 2
Specify the type of your config. This icludes, "@type", "stat_prefix" and "cluster".

#### HINT
A code snippet of the almost completed filter! ALMOST!!!

```yaml
- name: envoy.filters.network.tcp_proxy
typed_config: 
    '@type': "type.googleapis.com/envoy.extensions.filters.network.tcp_proxy.v3.TcpProxy"
    stat_prefix: tcp_proxy
    cluster: name_of_your_cluster
```

### Add the different endpoints and socket adresses for the different services

Link to Envoy's documentation about Load Balancer Subsets  - https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/subsets#examples

### Looking at the section - Example Host With Metadata

The following is an example configuration in YAML format:

```yaml
endpoint:
  address:
    socket_address:
      address: 127.0.0.1
      port_value: 8888
```

#### Note, that you need to change the values, according to your proxy!

You need to create four seperate endpoints, one for each of your endpoints with the appropriate adresses and port values.

#### Test
To test you need to use 
```
curl http://localhost:8080/
```
This is because as a Layer 4 Proxy, Envoy only manages the TCP connections. It does not know about the specifics of the request. 
Browser always tries to use the same TCP connection, whereas 'curl', always establishes a new one, every time it is prompted.