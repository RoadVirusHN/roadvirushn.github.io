require 'securerandom'
# frozen_string_literal: true
module PostprocessCallout
  HTML_CALLOUT_MARK_REGEX = /<!-- #@#callout-(?<type>.*?)#@#(?<title>.*?)#@#(?<collapse>[+-])?(?<copy>c)? -->\n(?<content>[\s\S]*?)<!-- @#@-(?:\k<type>)@#@(?:\k<title>)@#@ -->\n/

  def convert_callout(str)
    str.gsub(HTML_CALLOUT_MARK_REGEX).with_index do |_matched, _index|
      build_callout({ type: Regexp.last_match(1),
                      title: Regexp.last_match(2),
                      collapse: Regexp.last_match(3),
                      copy: Regexp.last_match(4),
                      content: Regexp.last_match(5),
                      emoji: get_emoji_from_type(Regexp.last_match(1)) })
    end
  end

  def build_callout(data)
    type, emoji, title, collapse, content, copy = \
      data.values_at(:type, :emoji, :title, :collapse, :content, :copy)
    converted_title, content = get_converted_title(title, content)
    "<div class=\"callout callout-#{type}\" id=\"callout-#{SecureRandom.uuid}\">
      <div class=\"header\">
        <span class=\"emoji\">#{emoji}</span>
        <span class=\"title\"><strong>#{title == '' ? type : converted_title}</strong></span>
        #{build_collapse(collapse)}
      </div>
      #{build_content(content, copy)}
    </div>"
  end

  def build_collapse(collapse)
    "<button class=\"collapse\">#{collapse == '-' ? '🔽' : '🔼'}</button>"
  end

  def build_content(content, copy)
    return '' if content.gsub(/\s/, '').empty?

    "<div class=\"card\" name=\"card\">
    #{unless copy.nil?
        '<button class="copy">📋</button>
        <button class="copy-check copy-emoji">✅
          <span class="copy-check copy-text"> Copied! </span>
        </button>
        '
      end}
    <div class=\"content\" name=\"content\">#{content}</div>
    </div>"
  end

  def get_converted_title(title, content)
    converted_title = if content && title
                        content.lines.first.sub(%r{<p>title: ([\s\S]*?)</p>}) { Regexp.last_match(1) }
                      else
                        title
                      end
    content = content.lines[1..].join if content && title != ''
    [converted_title, content]
  end

  def get_emoji_from_type(type)
    emojis_data = JSON.parse(File.open('_data/json/callout_emojis.json').read)
    if emojis_data.key?(type)
      emojis_data[type]
    else
      '✨'
    end
  end
end
