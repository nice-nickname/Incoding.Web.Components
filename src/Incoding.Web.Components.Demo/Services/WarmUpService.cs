namespace Incoding.Web.Components.Demo
{
    public class WarmUpHostedService(IHostApplicationLifetime lifetime) : BackgroundService
    {
        public static HttpClient http = new HttpClient();

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!await WaitForAppStartup(lifetime, stoppingToken))
            {
                return;
            }

            await WarmUp(stoppingToken);
        }

        private async Task WarmUp(CancellationToken stoppingToken)
        {

        }

        private async Task<bool> WaitForAppStartup(IHostApplicationLifetime lifetime, CancellationToken stoppingToken)
        {
            var startedSource = new TaskCompletionSource();
            var cancelledSource = new TaskCompletionSource();

            using var reg1 = lifetime.ApplicationStarted.Register(() => startedSource.SetResult());
            using var reg2 = stoppingToken.Register(() => cancelledSource.SetResult());

            Task completedTask = await Task.WhenAny(
                startedSource.Task,
                cancelledSource.Task).ConfigureAwait(false);

            return completedTask == startedSource.Task;
        }
    }
}
