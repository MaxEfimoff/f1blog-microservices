docker build -t maxefi/auth:latest         -t maxefi/auth:$SHA         -f ./containers/back/auth/Dockerfile       ./containers/back/auth
docker build -t maxefi/blogpost:latest     -t maxefi/blogpost:$SHA     -f ./containers/back/blogpost/Dockerfile   ./containers/back/blogpost
docker build -t maxefi/group:latest        -t maxefi/group:$SHA        -f ./containers/back/group/Dockerfile      ./containers/back/group
docker build -t maxefi/newsitem:latest     -t maxefi/newsitem:$SHA     -f ./containers/back/newsitem/Dockerfile   ./containers/back/newsitem
docker build -t maxefi/profile:latest      -t maxefi/profile:$SHA      -f ./containers/back/profile/Dockerfile    ./containers/back/profile
docker build -t maxefi/fe-auth:latest      -t maxefi/fe-auth:$SHA      -f ./containers/front/auth/Dockerfile      ./containers/front/auth
docker build -t maxefi/fe-container:latest -t maxefi/fe-container:$SHA -f ./containers/front/container/Dockerfile ./containers/front/container
docker build -t maxefi/fe-dashboard:latest -t maxefi/fe-dashboard:$SHA -f ./containers/front/dashboard/Dockerfile ./containers/front/dashboard
docker build -t maxefi/fe-mainpage:latest  -t maxefi/fe-mainpage:$SHA  -f ./containers/front/mainpage/Dockerfile  ./containers/front/mainpage
docker build -t maxefi/fe-marketing:latest -t maxefi/fe-marketing:$SHA -f ./containers/front/marketing/Dockerfile ./containers/front/marketing

docker push maxefi/auth:latest
docker push maxefi/blogpost:latest
docker push maxefi/group:latest
docker push maxefi/newsitem:latest
docker push maxefi/profile:latest
docker push maxefi/fe-auth:latest
docker push maxefi/fe-container:latest
docker push maxefi/fe-dashboard:latest
docker push maxefi/fe-mainpage:latest
docker push maxefi/fe-marketing:latest

docker push maxefi/auth:$SHA
docker push maxefi/blogpost:$SHA
docker push maxefi/group:$SHA
docker push maxefi/newsitem:$SHA
docker push maxefi/profile:$SHA
docker push maxefi/fe-auth:$SHA
docker push maxefi/fe-container:$SHA
docker push maxefi/fe-dashboard:$SHA
docker push maxefi/fe-mainpage:$SHA
docker push maxefi/fe-marketing:$SHA

kubectl apply -f infra/k8s
kubectl set image deployments/auth-depl             auth=maxefi/auth:$SHA
kubectl set image deployments/blogpost-depl         blogpost=maxefi/blogpost:$SHA
kubectl set image deployments/group-depl            group=maxefi/group:$SHA
kubectl set image deployments/newsitem-depl         newsitem=maxefi/newsitem:$SHA
kubectl set image deployments/profile-depl          profile=maxefi/profile:$SHA
kubectl set image deployments/fe-auth-depl          fe-auth=maxefi/fe-auth:$SHA
kubectl set image deployments/client-container-depl fe-container=maxefi/fe-container:$SHA
kubectl set image deployments/fe-dashboard-depl     fe-dashboard=maxefi/fe-dashboard:$SHA
kubectl set image deployments/fe-mainpage-depl      fe-mainpage=maxefi/fe-mainpage:$SHA
kubectl set image deployments/fe-marketing-depl     fe-marketing=maxefi/fe-marketing:$SHA


