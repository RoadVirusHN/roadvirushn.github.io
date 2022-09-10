module PostprocessWikilink
  INTERNAL_LINK_REGEX = %r{<a(?:\b[^<>]*?)href=(?:"|')([^"'<>]*)(?:"|')(?:[^<>]*?)class=(?:"|')wikilink(?:"|')(?:[^<>]*?)>([\s\S]*?)</a>}.freeze
  EXTERNAL_LINK_REGEX = %r{<a(?:\b[^<>]*?)href=(?:"|')([^"'<>]*)(?:"|')(?:[^<>]*?)class=(?:"|')wikilink externallink(?:"|')(?:[^<>]*?)>([\s\S]*?)</a>}.freeze

  def convert_wikilink(str)
    str = str.gsub(EXTERNAL_LINK_REGEX) do |matched|
      change_external_link(Regexp.last_match(1), matched)
    end
    str.gsub(INTERNAL_LINK_REGEX) do |matched|
      change_internal_link(Regexp.last_match(1), matched)
    end
  end

  def change_external_link(href, a_tag)
    "<span class='link-warning'>
      #{a_tag}
      <span class='link-warning-text'>보안 확인 : <em>외부링크</em><br/><em>
      \"#{href.length > 30 ? "#{href.slice(0, 30)}..." : href}\"</em>로 이동?<br/>
        <button onclick=\"window.open('#{href}','_blank'); return false;\">yes</button>
      </span>
    </span>"
  end

  def change_internal_link(_href, a_tag)
    a_tag
  end
end
