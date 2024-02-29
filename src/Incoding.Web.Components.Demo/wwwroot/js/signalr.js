class SignalRController {

    connection

    projectsStream

    constructor() {
        let builder = new signalR.HubConnectionBuilder().withUrl("/signals")

        if (ExecutableBase.IsDebug) {
            builder.configureLogging(signalR.LogLevel.Information)
        }

        this.connection = builder.build()

        this.connection.on("signal", data => {
            let eventType = data.EventType
            $('[name=SignalHub]').trigger(eventType.toLowerCase(), data)
        });
    }

    start() {
        this.connection.start();
    }

    startProjectsStream(queryJson) {
        this.cancelProjectsStream()

        let portionIndex = 0

        this.projectsStream = this.connection
            .stream("StreamProjectStaffing", queryJson)
            .subscribe({
                next: (data) => {
                    $('#GetProjectStaffingWebQuery').trigger('load', { data, portionIndex })
                    portionIndex++
                },
                complete: () => { },
                error: (err) => {
                    alert(err)
                }
            })
    }

    cancelProjectsStream() {
        if (this.projectsStream) {
            this.projectsStream.dispose()
        }
    }
}

const signalrController = new SignalRController();

signalrController.start();
