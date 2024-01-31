namespace Incoding.Web.Components
{
    #region << Using >>

    using System.Text;

    #endregion

    public static class StringBuilderHelper
    {
        public static StringBuilder Default => new StringBuilder(1024 * 10);
    }
}
