@Library(['github.com/indigo-dc/jenkins-pipeline-library@2.1.1']) _

def projectConfig

pipeline {
    agent any

    stages {
        stage('SQA baseline criterion: QC.Sty & QC.Uni & QC.Doc') {
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