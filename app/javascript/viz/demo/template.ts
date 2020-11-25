export const template = `
svg{
    height = 500; width = 500
    Columns{
        Component {
            Rect {
                height = 100; width = 100
                fill = "red"
            }
        }
        Component {
            Text {
                text = "Hello Demo"
                anchor = @anchor("l", "m")
                fontSize = 50
                fill = "blue"
            }
        }
    }
}
` 