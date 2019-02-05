node {

    stage('setup') {
        checkout scm
    }

    stage('fetch dependencies') {
        sh 'npm install'
    }

    stage('run tests') {
        sh 'npm test'
    }

}