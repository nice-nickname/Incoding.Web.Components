namespace Incoding.Web.Components.Grid
{
    #region << Using >>

    #endregion

    public class WebsocketLoadingOptions
    {
        public bool Enabled { get; set; }

        public int ChunkSize { get; set; } = 40;

        public int LoadingRows { get; set; }

        public string Method { get; set; }
    }
}
