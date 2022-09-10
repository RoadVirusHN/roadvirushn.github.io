module PreprocessWikiLink
  OBSIDIAN_LINK_REGEX = %r{(?<!!)\[\[((?:(?!https?:\/\/).*\/)?(?:([^|/\^\#*?\]\[]+)))?((?:(?:\#[^#\]\[)|]*(?![|\]]))*(\#[^)\]|]*)?)?)?(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@:%_+.~\#?&/=]*))?(?:\|([^\#|\]\[]+))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*\Z)}.freeze
  MARKDOWN_LINK_REGEX = %r{(?<!!)\[([^\#|\]]+)?\]\((?:(?:(?!https?:\/\/).*\/)?(?:(?:([^|\/\^\#*?\]\[.]+)(?:.[a-z]{2,3})?))?((?:(?:\#[^#`)(]+?)+?(?!\)))?(\#[^#`)(]+)?)?)?(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@:%_+.~\#?&\/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*\Z)}.freeze

  # rubocop:disable Metrics/MethodLength(RuboCop)
  def convert_wikilink(site, post)
    content = post.content
        .gsub(MARKDOWN_LINK_REGEX) do
      build_markdown_link({
                            alt_text: Regexp.last_match(1),
                            post_name: Regexp.last_match(2)&.gsub('%20', ' '),
                            raw_headings: Regexp.last_match(3),
                            target_heading: Regexp.last_match(4),
                            external_url: Regexp.last_match(5)
                          }, site, post)
    end
    content.gsub(OBSIDIAN_LINK_REGEX) do
      build_markdown_link({
                            alt_text: Regexp.last_match(6),
                            post_name: Regexp.last_match(2),
                            external_url: Regexp.last_match(5),
                            raw_headings: Regexp.last_match(3),
                            target_heading: Regexp.last_match(4)
                          }, site, post)
    end
  end
  # rubocop:enable Metrics/MethodLength(RuboCop)

  def build_markdown_link(link_data, site, post)
    innertext = build_innertext(link_data)

    is_link_in_this_post = link_in_this_post?(link_data, post)

    href = build_href(site, link_data, is_link_in_this_post)

    add_link_properties(link_data[:external_url], is_link_in_this_post, innertext, href)
  end

  def add_link_properties(external_url, is_link_in_this_post, innertext, href)
    "[#{innertext || '🔗'}](#{href}){: .wikilink}#{'{:target="_blank"}' unless is_link_in_this_post}#{'{: .externallink}' if external_url}"
  end

  def link_in_this_post?(link_data, post)
    external_url, post_name, target_heading =
      link_data.values_at(:external_url, :post_name, :target_heading)
    file_name = "#{post.date.strftime('%Y-%m-%d')}-#{post['slug']}"
    post_name ? (post_name == post['title'] || post_name == file_name) : (target_heading || external_url&.include?(post.url))
  end

  def build_innertext(link_data)
    alt_text, external_url, post_name, raw_headings =
      link_data.values_at(:alt_text, :external_url, :post_name, :raw_headings)

    alt_text || external_url || raw_headings_to_innertext((post_name || '') + (raw_headings || '')) || 'Empty Link'
  end

  def build_href(site, link_data, is_link_in_this_post)
    external_url, post_name, target_heading =
      link_data.values_at(:external_url, :post_name, :target_heading)

    external_url || \
      (if is_link_in_this_post
         (raw_headings_to_href(target_heading) || '#')
       else
         link_to_other_post(site.posts, post_name, target_heading)
       end)
  end

  def raw_headings_to_innertext(string)
    string&.sub(/^#/, '')&.gsub(/#+/, '> ')
  end

  def raw_headings_to_href(string)
    string&.downcase&.gsub(/^#+ +/, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+$}, '')&.gsub(%r{^[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '-')
  end

  def link_to_other_post(posts, post_name, target_heading)
    post = find_post_by_name(posts, post_name)

    if post.length == 1
      post[0].url + (raw_headings_to_href(target_heading) || '')
    elsif post.length > 1
      raise "ERROR post title: #{post_name} => Duplicated posts."
    elsif post.empty?
      raise "ERROR post title: #{post_name} => No such a post in your website."
    end
  end

  def find_post_by_name(posts, post_name)
    posts.docs.filter do |doc|
      post_name == doc['title'] || post_name == doc.basename.gsub(doc.extname, '')
    end
  end
end
