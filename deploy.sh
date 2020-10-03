#!/usr/bin/env bash
BRANCH_NAME=$1;

if [[ $BRANCH_NAME == "master" ]]; then
	cd /home/pi/Apps/sysmon/api
else
	exit 0;
fi


echo "Stashing lock files "
git stash

echo "Dropping stash"
git stash drop

echo "Pulling from ${BRANCH_NAME}"
git pull origin ${BRANCH_NAME}
echo "Pulled successfully"

echo "Reinstalling dependencies"
npm install
echo "Project dependencies was installed"

echo "Rebooting Sysmon API"

if [[ $BRANCH_NAME == "master" ]]; then
	echo "pm2 restart sysmon-api"
else
    exit 0;
fi
echo "Reboot OK"
echo "Deployment complete, and it was a success!"

exit 0
