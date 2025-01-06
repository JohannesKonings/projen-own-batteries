# ssm quick setup

https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html


`aws ssm start-session --target <<instance-id>> --region <<region>>`

```bash
aws ssm start-session   --region <<region>> \ 
                        --target <<instance-id>> \
                        --document-name AWS-StartPortForwardingSession \
                        --parameters '{"portNumber":["8080"],"localPortNumber":["9999"]}'
```	