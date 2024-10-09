namespace Incoding.Web.Components.Grid.Rendering;

public static class TemplateEncoder
{
    public static string Encode(string template)
    {
        return template.Replace("{{", "!-").Replace("}}", "-!");
    }
}
