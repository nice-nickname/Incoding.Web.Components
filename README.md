Что должен уметь грид

- Рендерить колонки +
- Форматировать числа/даты в колонках +
- Возможность кастомного контента в колонках +
  - Обычные +
  - Stacked + 
  - Spreaded +
- Вложенные таблицы +
- Expand/collapse +-
- Сплиттер на несколько таблиц
- Ховер для всех строк в таблице
- Перерендер отдельной строки
- Добавление новых строк динамически +
- Вставка контента вложенных таблиц динамически

Advanced
- Блокировка отдельной строки (строк) LockOpenProjectCommand
- Hover, on drop action
- Пересчет отдельной строки

```csharp

Html.Planifi().Components.Grid("project-staffing-grid")
    .Split(splitter => 
    {
        splitter
            .Css("table table-primary")
            .Rows(row => row.Css("tr-item-calculate"))
            
        splitter.Add("regular").Split(split => 
        {
            split.Columns(cols => 
            {
                cols.Add().Title().Field()
                cols.Add().Title().Field()
                cols.Add().Title().Field()
                cols.Stacked("JTD", s => {
                    s.Add().Title("Hrs").Field("JTDHours")
                    s.Add().Title("$").Field("JTDMoney")
                })
            })
        })

        splitter.Add("history").Split(split => 
        {
            var historyColumns = 
            (cols) => 
                cols.Spread(s => s.PlannedVsActual, (s, i) => {
                    s.Stacked(dates[i], s => {
                        s.Add().Field("Planned")
                        s.Add().Field("Actual")
                    })
                })

            split.Cols(historyColumns)

            split.Nested(split => {
                split.Cols(historyColumns)

                split.Nested(split => {
                    split.Cols(historyColumns)
                })
            })
        })

        splitter.Add("periods").Split(cols => 
        {
            cols.Spread(s => s.Hours, (s, i) => {
                s.Add().Title("Hours").Field("Value")
            })
        })
    })
    .Bind(iml => iml.When(ComponentBinds.Init)
                    .OnSuccess(dsl => dsl.Self()))
    .Render();

```
