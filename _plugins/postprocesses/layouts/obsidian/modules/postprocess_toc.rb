# frozen_string_literal: true

# Get Headings data and Create TOC.
require 'nokogiri'
module PostprocessToc
  TOC_CONFIG_REGEX = /(?<key>style|min_depth|max_depth|title|allow_inconsistent_headings|delimiter|varied_style): (?<value>.*)/

  def convert_noneng_custom_id(html)
    html.css('h1, h2, h3, h4, h5, h6').each do |h|
      h['id'] = text_to_id_format(h.content)
    end
    html
  end

  def convert_toc(html)
    html.css('code.language-toc').each_with_index do |code, index|
      config = get_config_from_raw_toc(code)
      config[:toc_index] = index
      result = build_toc(html, config)
      code.parent.replace result
    end
    html
  end

  def build_toc(html, config)
    style, title, index, min_depth, max_depth = config.values_at(:style, :title, :toc_index, :min_depth, :max_depth)
    toc_top = html.create_element(style.downcase == 'bullet' ? 'ul' : 'ol', { 'id' => "markdown-toc-#{index}" })
    toc_top.inner_html = "<span><strong>#{title}</strong></span>" if title != ''
    toc = []
    html.css('h1, h2, h3, h4, h5, h6').select { |h| Integer(h.name[1]) >= min_depth && Integer(h.name[1]) <= max_depth }
        .each_with_index do |h, h_id|
      level = Integer(h.name[1])
      notop = false
      toc.to_enum.with_index.reverse_each do |p, _p_id|
        next unless Integer(p['lvl']) < level

        h_item = build_toc_items(html, h, level - Integer(p['lvl']), config, h_id)
        h_item['lvl'] = level
        p.at_css('ul, ol').add_child(h_item)
        toc.push(h_item)
        notop = true
        break
      end
      next if notop

      h_item = build_toc_items(html, h, level - min_depth, config, h_id)
      h_item['lvl'] = level
      toc_top.add_child(h_item)
      toc.push(h_item)
    end
    toc_top
  end

  def get_config_from_raw_toc(code)
    config = { style: 'bullet', min_depth: 1, max_depth: 6, varied_style: 'false', title: '' }
    code.content.scan(TOC_CONFIG_REGEX) do |_matched|
      config[Regexp.last_match(1).to_sym] = Regexp.last_match(2)
    end
    config[:min_depth] = Integer(config[:min_depth])
    config[:max_depth] = Integer(config[:max_depth])
    config[:varied_style] = config[:varied_style] == 'true'
    config
  end

  def get_list_type(config)
    if config[:varied_style]
      return config[:style].downcase == 'bullet' ? 'ol' : 'ul'
    end

    config[:style].downcase == 'bullet' ? 'ul' : 'ol'
  end

  def build_toc_items(html, heading, gen_gap, config, id)
    result = html.create_element('li')
    (1..gen_gap - 1).each do |_i|
      result.add_child(html.create_element('li'))
      result = result.at_css('li')
    end
    a_tag = html.create_element('a', { 'id' => "markdown-toc-#{config[:toc_index]}-#{id}", 'href' => "##{heading['id']}"})
    a_tag.content = heading.content
    result.add_child(a_tag)
    result.add_child(html.create_element(get_list_type(config)))
    result
  end

  def text_to_id_format(str)
    str.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+$},
             '')&.gsub(%r{^[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+},
                       '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '-')
  end
end
