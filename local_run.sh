#! /bin/sh
echo "======================================================================"
echo "Welcome to to the setup. This will setup the local virtual env." 
echo "And then it will install all the required python libraries."
echo "You can rerun this without any issues."
echo "----------------------------------------------------------------------"
if [ -d ".env" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run local_setup.sh first"
    exit N
fi

# Activate virtual env
. .env/bin/activate
export ENV=development
export SECRET_KEY=_5#y2LF4Q8z\n\xec]/
python3 main.py 
deactivate
