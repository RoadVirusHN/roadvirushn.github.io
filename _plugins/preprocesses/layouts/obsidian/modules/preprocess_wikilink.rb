# frozen_string_literal: true

module PreprocessWikiLink
  OBSIDIAN_LINK_REGEX = %r{(?<!!)\[\[((?:(?!https?://).*/)?(?:([^|/\^\#*?\]\[]+)))?((?:(?:\#[^#\]\[)|]*(?![|\]]))*(\#[^)\]|]*)?)?)?(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@:%_+.~\#?&/=]*))?(?:\|([^\#|\]\[]+))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*\Z)}
  MARKDOWN_LINK_REGEX = %r{(?<!!)\[([^\#|\]]+)?\]\((?:(?:(?!https?://).*/)?(?:(?:([^|/\^\#*?\]\[.]+)(?:.[a-z]{2,3})?))?((?:(?:\#[^#`)(]+?)+?(?!\)))?(\#[^#`)(]+)?)?)?(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@:%_+.~\#?&/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*\Z)}

  # rubocop:disable Metrics/MethodLength(RuboCop)
  def convert_wikilink(site, article)
    content = article.content
                  .gsub(MARKDOWN_LINK_REGEX) do
      build_markdown_link({
                            alt_text: Regexp.last_match(1),
                            article_name: Regexp.last_match(2)&.gsub('%20', ' '),
                            raw_headings: Regexp.last_match(3),
                            target_heading: Regexp.last_match(4),
                            external_url: Regexp.last_match(5)
                          }, site, article)
    end
    content.gsub(OBSIDIAN_LINK_REGEX) do
      build_markdown_link({
                            alt_text: Regexp.last_match(6),
                            article_name: Regexp.last_match(2),
                            external_url: Regexp.last_match(5),
                            raw_headings: Regexp.last_match(3),
                            target_heading: Regexp.last_match(4)
                          }, site, article)
    end
  end
  # rubocop:enable Metrics/MethodLength(RuboCop)

  def build_markdown_link(link_data, site, article)
    innertext = build_innertext(link_data)

    is_innerlink = link_in_this_article?(link_data, article)

    href = build_href(site, link_data, is_innerlink, article['title'])

    add_link_properties(link_data[:external_url], is_innerlink, innertext, href)
  end

  def add_link_properties(external_url, is_innerlink, innertext, href)
    link = "[#{innertext || '🔗'}](#{href}){: .wikilink}"
    link += '{:target=\"_blank\"}' unless is_innerlink
    link += '{: .externallink}' if external_url
    link
  end

  def link_in_this_article?(link_data, article)
    external_url, article_name, target_heading =
      link_data.values_at(:external_url, :article_name, :target_heading)
    file_name = "#{article.date.strftime('%Y-%m-%d')}-#{article['slug']}"
    article_name ? (article_name == article['title'] || article_name == file_name) : (target_heading || external_url&.include?(article.url))
  end

  def build_innertext(link_data)
    alt_text, external_url, article_name, raw_headings =
      link_data.values_at(:alt_text, :external_url, :article_name, :raw_headings)

    alt_text || external_url || raw_headings_to_innertext((article_name || '') + (raw_headings || '')) || 'Empty Link'
  end

  def build_href(site, link_data, is_innerlink. article_title)
    external_url, article_name, target_heading =
      link_data.values_at(:external_url, :article_name, :target_heading)

    external_url || \
      (if is_innerlink
         (raw_headings_to_href(target_heading) || '#')
       else
         link_to_other_article(site.collections['articles'], article_name, target_heading, article_title)
       end)
  end

  def raw_headings_to_innertext(string)
    string&.sub(/^#/, '')&.gsub(/#+/, '> ')
  end

  def raw_headings_to_href(string)
    string&.downcase&.gsub(/^#+ +/, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+$}, '')&.gsub(%r{^[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '-')
  end

  def link_to_other_article(articles, target_article_name, target_heading, article_title)
    article = find_article_by_name(articles, target_article_name)

    if article.length == 1
      article[0].url + (raw_headings_to_href(target_heading) || '')
    elsif article.length > 1
      puts "ERROR IN #{article_title}: taget_title: #{target_article_name} => Duplicated articles."
      article[0].url + (raw_headings_to_href(target_heading) || '')
    elsif article.empty?
      puts "ERROR IN #{article_title}: target_title: #{target_article_name} => No such a article in your website."
      ''
    end
  end

  def find_article_by_name(articles, article_name)
    articles.docs.filter do |article|
      article_name == article['title'] || article_name == article.basename.gsub(article.extname, '')
    end
  end
end
