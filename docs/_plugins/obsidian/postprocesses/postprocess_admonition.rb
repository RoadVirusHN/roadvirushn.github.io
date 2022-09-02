module PostprocessAdmonition
  HTML_ADMONITION_MARK_REGEX = /<!-- #@#admonition-(?<type>.*?)#@# (?<title>.*?)#@# -->\n(?<content>[\s\S]*?)<!-- @#@-(\k<type>)@#@ (\k<title>)@#@ -->\n/
  
  def convert_admonition(str)
    str.gsub(HTML_ADMONITION_MARK_REGEX){|matched|
      data = {
        type: Regexp.last_match(1),
        title: Regexp.last_match(2),
        content: Regexp.last_match(3),
        emoji: get_emoji_from_type(Regexp.last_match(1))
      }
      build_admonition(data)
    }
  end
  
  def build_admonition(data)
    "<div style='background-color: gray;'><span><strong>#{data[:emoji]} #{data[:title]}</strong></span>#{data[:content]}</div>"
  end


  def get_emoji_from_type(type)
    return "✍️" if type == "example"
    return "🗒️" if type == "note"
    return "ℹ️" if type == "information"
    return "⚠️" if type == "warning"
    return "☠️" if type == "danger"
    "✨"
  end
end