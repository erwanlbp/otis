#!/bin/bash

##──── Question 0 ────────────────────────────────────────────────────────────────────────
deploy_message="git commit $(git rev-parse --short HEAD)"
read -p "
Quel message de déploiement ?
	(press <enter> for '${deploy_message}') : " q0
if [[ "${q0}" != "" ]]
then
	deploy_message="${q0}"
fi

firebase deploy --only hosting --message "${deploy_mesage}"

exit 0
