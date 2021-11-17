# 初期セットアップ
setup:
	docker-compose build
	docker-compose up

# dockerの状態をすべてclean up してコンテナを立て直す(時間がかかるが、なにかおかしいときに使える)
reset:
	docker-compose down --rmi all --volumes --remove-orphans
	docker-compose build --no-cache
	docker-compose up

# docker内のnode-modulesを最新にし、yarn buildし直す
yarn-build-docker:
	docker-compose up -d
	docker-compose exec frontend bash -c "yarn install --no-save"
	docker-compose exec frontend bash -c "yarn build"