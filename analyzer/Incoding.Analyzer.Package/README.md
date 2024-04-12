## Incoding.Analyzer

Custom roslyn code analyzer for [Incoding.Framework](https://github.com/Incoding-Software/Incoding-Framework-Core)


## Installation

Download this package on nuget via Visual Studio!


## Capabilities

- Validate UrlDispatcher Query, Push, Model schemas

```csharp
// Defined type
public class SampleQuery
{
    public int Id { get; set; }

    public string Name { get; set; }
}

Url.Dispatcher().Query<SampleQuery>(new 
{
    id = 1
//  ^^ Warning! Mistyped parameter!

    NAME = "Incoding.Software"
//  ^^ Warning! Mistyped parameter!

    Description = "😊"
//  ^^ Error! Property 'Description' is not presented in 'SampleQuery'!
})
```
