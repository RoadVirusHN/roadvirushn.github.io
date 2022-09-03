module PostprocessAdmonition
  HTML_ADMONITION_MARK_REGEX = /<!-- #@#admonition-(?<type>.*?)#@#(?<title>.*?)#@#(?<collapse>[+-])?(?<copy>[c])? -->\n(?<content>[\s\S]*?)<!-- @#@-(?:\k<type>)@#@(?:\k<title>)@#@ -->\n/.freeze

  def convert_admonition(str)
    str.gsub(HTML_ADMONITION_MARK_REGEX) do |_matched, index|
      data = { type: Regexp.last_match(1),
               title: Regexp.last_match(2),
               collapse: Regexp.last_match(3),
               copy: Regexp.last_match(4),
               content: Regexp.last_match(5),
               index: index,
               emoji: get_emoji_from_type(Regexp.last_match(1))}
      build_admonition(data)
    end
  end

  def build_admonition(data)
    "<div class=\"admonition\" id=\"admonition-#{data[:index]}\">
      <div class=\"header\">
        <span class=\"emoji\">#{data[:emoji]}</span> <span class=\"title\"><strong> #{data[:title] == '' ? data[:type] : data[:title] }</strong></span>
        #{data[:collapse].nil? ? '' : '<div class="collapse">🔻</div>'}
      </div>#{
        data[:content].match(/./) ? 
        "<div class=\"card\">#{
          "<div class=\"copy\">
          📋
          </div>" unless data[:copy].nil?
        }
        #{data[:content]}
        </div>"
        :
        ''
      }
    </div>" + get_style_from_data(data)
  end

  def get_colors_from_type(type)
    return {main: "floralwhite", emphasis: "blueviolet", header: "lavender"} if type == 'example'
    return {main: "floralwhite", emphasis: "blue", header: "royalblue"} if type == 'note'
    return {main: "floralwhite", emphasis: "skyblue", header: "turquoise"} if type == 'info'
    return {main: "floralwhite", emphasis: "orange", header: "peachpuff" } if type == 'warning'
    return {main: "floralwhite", emphasis: "red", header: "lightcoral" } if type == 'danger'
    # return {main: "floralwhite", emphasis: "", header: "" } if type == 'seealso'
    # return {main: "floralwhite", emphasis: "", header: "" } if type == 'tip'

    {main: "floralwhite", emphasis: "grey", header: "lightgrey"}
  end

  def get_style_from_data(data)
    type, index, collapse, copy = data.values_at(:type, :index, :collapse, :copy)
    colors = get_colors_from_type(type)
    "<style> 
      #admonition-#{index} {
        background-color: #{colors[:main]};
        border-radius: 4px 8px 8px 4px;
        padding: 0px 5px 0px 5px;
        box-shadow: 3px 3px 3px;
        border-left: solid 8px #{colors[:emphasis]};
        margin-top: 10px;
        margin-bottom: 10px;
      }

      #admonition-#{index} > div.header {
        background-color: #{colors[:header]};
        border-radius: 0px 8px 0px 0px;
        padding: 8px;
        margin: -5px;
      }

      #admonition-#{index} > div.card {
        padding: 8px 8px 1px 8px;
      }
    </style>"
  end

  def get_emoji_from_type(type)
    return '️🧾️' if type == 'example'
    return '✍' if type == 'note'
    return 'ℹ️' if type == 'info'
    return '⚠️' if type == 'warning'
    return '☠️' if type == 'danger'

    '✨'
  end
end
