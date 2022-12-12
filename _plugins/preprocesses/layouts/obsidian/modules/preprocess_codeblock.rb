# frozen_string_literal: true

module PreprocessCodeblock
  CODEBLOCK_REGEX = /(?<front_tag>```(?<type>[a-zA-Z]*))\n(?<content>[\s\S]*?)(?<back_tag>```)[\s]*\n/
  CODE_REGEX = /(?<front_tag>```(?<type>[a-zA-Z]*))\n(?<content>[\s\S]*?)(?<back_tag>```)[\s]*\n/

  def convert_html_codeblock(str)
    str.gsub(CODEBLOCK_REGEX) do |_matched|
      type = Regexp.last_match(2)
      content = Regexp.last_match(3)
      content = content.gsub('<') do |_matched|
        "&#60;"
      end
      .gsub('>') do |_matched|
        "&#62;"
      end
      .gsub('&') do |_matched|
        "&#38;"
      end
      .gsub('"') do |_matched|
        "&#34;"
      end
      .gsub("'") do |_matched|
        "&#39;"
      end
      .gsub("%") do |_matched|
        "&#37;"
      end
      .gsub("{") do |_matched|
        "&#123;"
      end 
      .gsub("}") do |_matched|
        "&#125;"
      end 
      "```#{type}\n#{content}\n```\n"
    end
  end
end
