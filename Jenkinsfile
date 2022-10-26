@Library(['github.com/indigo-dc/jenkins-pipeline-library@2.1.1']) _

def projectConfig

pipeline {
    agent any

    environment {
        O3WEBAPP_DOCKER_TAG = "${env.BRANCH_NAME == 'main' ? 'stage' : env.BRANCH_NAME}"
        //O3WEBAPP_DOCKER_TARGET = "${env.BRANCH_NAME == 'main' ? 'production' : 'development'}"
        O3WEBAPP_DOCKER_TARGET = "production"
    }

    stages {
        stage('SQA baseline criterion: QC.Sty & QC.Uni & QC.Sec & QC.Doc') {
            steps {
                script {
                    projectConfig = pipelineConfig(
                        configFile: '.sqa/config.yml',
                        scmConfigs: [ localBranch: true ],
                        validatorDockerImage: 'eoscsynergy/jpl-validator:1.2.1'
                    )
                    buildStages(projectConfig)
                }
            }
            post {
                always {
                    // replace path in the docker container with relative path
                    sh "sed -i 's/\\/sqaaas-build/./gi' eslint-codestyle.xml"
                    recordIssues(
                        enabledForFailure: true, aggregatingResults: true,
                        tool: checkStyle(pattern: 'eslint-codestyle.xml',
                                         reportEncoding:'UTF-8',
                                         name: 'CheckStyle')
                    )
                }
                cleanup {
                    cleanWs()
                }
            }
        }
    }
}