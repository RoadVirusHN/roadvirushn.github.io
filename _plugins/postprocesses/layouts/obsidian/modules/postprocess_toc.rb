# frozen_string_literal: true

# Get Headings data and Create TOC.
module PostprocessToc
  NO_ID_HEADINGS_REGEX = %r{<h(?<level>[123456])>(?<innerText>.*)</h\k<level>>(?=[^`]*(?:`[^`]*`[^`]*)*\Z)}
  HTML_TOC_REGEX = %r{<pre><code[^>]+class\s*=\s*['"]language-toc['"][^>]*>([\s\S]*?)</code></pre>}i
  TOC_CONFIG_REGEX = /(?<key>style|min_depth|max_depth|title|allow_inconsistent_headings|delimiter|varied_style): (?<value>.*)/
  HEADINGS_REGEX = %r{<h(?<level>[123456])[^>]+id\s*=\s*['"](?<id>[^'"]+)['"][^>]*>(?<innerText>.*)</h\k<level>}
  CODE_BLOCK = %r{<code\b[^<>]*>([\s\S]*?)</code>}

  def convert_noneng_custom_id(str)
    str.gsub(NO_ID_HEADINGS_REGEX) do |_matched|
      headings = Regexp.last_match(1)
      inner_text = Regexp.last_match(2)
      "<h#{headings} id='#{text_to_id_format(inner_text)}'>#{inner_text}</h#{headings}>"
    end
  end

  def convert_toc(str)
    code_masked_str = str.gsub(CODE_BLOCK) { |_matched| '' }
    headings_data = get_heading_data(code_masked_str)
    str.gsub(HTML_TOC_REGEX).with_index do |matched, index|
      config = get_config_from_raw_toc(matched)
      config[:toc_index] = index
      render_headings_data = extract_render_headings(headings_data, config)
      build_toc(render_headings_data, config)
    end
  end

  def build_toc(headings_data, config)
    return '' if headings_data.empty?

    style, title, index, min_depth = config.values_at(:style, :title, :toc_index, :min_depth)
    top_list_type = style.downcase == 'bullet' ? 'ul' : 'ol'
    config[:list_type] = get_list_type(config)
    toc_tag = "<#{top_list_type} id='markdown-toc-#{index}'>\n"
    toc_tag += "<span><strong>#{title}</strong></span>" if title != ''
    toc_tag += build_toc_items(headings_data, config, min_depth - 1)
    "#{toc_tag}</#{top_list_type}>"
  end

  def get_heading_data(str)
    heading_data = []

    array_of_heading = get_all_headings(str)

    array_of_heading&.each_with_index do |heading, index|
      heading_data.push(heading) unless find_parent_from_above(Integer(index), heading, array_of_heading)
    end
    heading_data
  end

  def get_all_headings(str)
    str.scan(HEADINGS_REGEX).map do |element|
      heading = { level: Integer(element[0]), id: element[1], innerText: element[2],
                  childs: [] }
      heading
    end
  end

  def get_config_from_raw_toc(raw_toc)
    config = { style: 'bullet', min_depth: 1, max_depth: 6, varied_style: 'false', title: '' }
    raw_toc.scan(TOC_CONFIG_REGEX) do |_matched|
      config[Regexp.last_match(1).to_sym] = Regexp.last_match(2)
    end
    config[:min_depth] = Integer(config[:min_depth])
    config[:max_depth] = Integer(config[:max_depth])
    config[:varied_style] = config[:varied_style] == 'true'
    config
  end

  def extract_render_headings(headings_data, config)
    render_headings_data = []
    headings_data.each do |heading|
      if heading[:level] >= config[:min_depth] # check if this heading should be rendered.
        render_headings_data.push(heading)
      else
        render_headings_data += extract_render_headings(heading[:childs], config)
      end
    end
    render_headings_data
  end

  def get_list_type(config)
    if config[:varied_style]
      return config[:style].downcase == 'bullet' ? 'ol' : 'ul'
    end

    config[:style].downcase == 'bullet' ? 'ul' : 'ol'
  end

  def find_parent_from_above(index, heading, array_of_heading)
    array_of_heading.slice(0, index)&.reverse&.each do |above_heading|
      next unless above_heading[:level] < heading[:level]

      above_heading[:childs].push(heading)
      return true
    end
    false
  end

  def build_toc_items(headings_data, config, upper_level)
    result = ''
    list_type = config[:list_type]
    headings_data.each do |heading|
      next if heading[:level] > config[:max_depth]
      id, inner_text, lvl, childs = heading.values_at(:id, :innerText, :level, :childs)
      generation_gap = (lvl - upper_level)
      li_tag = "#{"<#{list_type}>" * (generation_gap - 1)}<li><a href='##{id}' id='markdown-toc-#{config[:toc_index]}-#{id}'>#{inner_text}</a>"
      li_tag += "<#{list_type}>#{build_toc_items(childs, config, lvl)}\n</#{list_type}>" unless childs.empty?
      li_tag += "</li> #{"</#{list_type}>" * (generation_gap - 1)}\n"
      result += li_tag
    end
    result
  end

  def text_to_id_format(str)
    str.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+$},
             '')&.gsub(%r{^[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '-')
  end
end
