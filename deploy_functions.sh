#!/bin/bash

deploy_mesage=""
read -p "
What is the deploy message ?
	(press <enter> for '${deploy_mesage}') : " q0

if [[ "${q0}" != "" ]]
then
	deploy_mesage="${q0}"
fi

firebase deploy --only functions --message "${deploy_mesage}"

exit 0
