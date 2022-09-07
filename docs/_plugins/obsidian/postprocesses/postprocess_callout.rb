module PostprocessCallout
  HTML_CALLOUT_MARK_REGEX = /<!-- #@#callout-(?<type>.*?)#@#(?<title>.*?)#@#(?<collapse>[+-])?(?<copy>c)? -->\n(?<content>[\s\S]*?)<!-- @#@-(?:\k<type>)@#@(?:\k<title>)@#@ -->\n/.freeze

  def convert_callout(str)
    str.gsub(HTML_CALLOUT_MARK_REGEX) do |_matched, index|
      data = { type: Regexp.last_match(1),
               title: Regexp.last_match(2),
               collapse: Regexp.last_match(3),
               copy: Regexp.last_match(4),
               content: Regexp.last_match(5),
               index: index,
               emoji: get_emoji_from_type(Regexp.last_match(1)) }
      build_callout(data)
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  def build_callout(data)
    type, index, emoji, title, collapse, content, copy = \
      data.values_at(:type, :index, :emoji, :title, :collapse, :content, :copy)
    "<div class=\"callout ad-#{type}\" id=\"callout-#{index}\">
      <div class=\"header\">
        <span class=\"emoji\">#{emoji}</span>
        <span class=\"title\"><strong>#{title == '' ? type : title}</strong></span>
        #{unless collapse.nil?
            "<button class=\"collapse\" onclick=\"hide_card(event)\">#{collapse == '-' ?  '🔽':'🔼'}</button>"
          end}
      </div>#{
        if content.match(/./)
          "<div class=\"card\" name=\"card\" style=#{collapse == '-' ? 'display:none;' : 'display:block;'}>
          #{'<button class="copy" onclick="copy_content(event)">📋</button>' unless copy.nil?}
          <div class=\"content\" name=\"content\">#{content}</div>
          </div>"
        else
          ''
        end
      }
    </div>"
  end

  def get_emoji_from_type(type)
    return '️🧾️' if type == 'example'
    return '✍' if type == 'note'
    return 'ℹ️' if type == 'info'
    return '⚠️' if type == 'warning'
    return '☠️' if type == 'danger'
    return '➕' if type == 'seealso'
    return '💡' if type == 'tip'

    '✨'
  end
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
end