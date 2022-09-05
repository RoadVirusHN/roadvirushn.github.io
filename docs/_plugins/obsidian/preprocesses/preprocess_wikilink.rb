module PreprocessWikiLink
  OBSIDIAN_LINK_REGEX = %r{(?<!!)\[\[((?:(?!https?://).*/)?(?:([^|/\^\#*?\]\[]+)))?((?:(?:\#[^#\]\[)|]*(?![|\]]))*(\#[^)\]|]*)?)?)?(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@:%_+.~\#?&/=]*))?(?:\|([^\#|\]\[]+))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*\Z)}
  MARKDOWN_LINK_REGEX = %r{(?<!!)\[([^\#|\]]+)?\]\((?:(?:(?!https?://).*/)?(?:(?:([^|/\^\#*?\]\[.]+)(?:.[a-z]{2,3})?))?((?:(?:\#[^#`)(]+?)+?(?!\)))?(\#[^#`)(]+)?)?)?(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[\-a-zA-Z0-9(@:%_+.~\#?&/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*\Z)}

  def convert_wiki_link(site, post)
    post.content
        .gsub(MARKDOWN_LINK_REGEX) do 
      build_markdown_link({
        altText: Regexp.last_match(1),
        postName: Regexp.last_match(2)&.gsub('%20', ' '),
        rawHeadings: Regexp.last_match(3),
        targetHeading: Regexp.last_match(4),
        externalURL: Regexp.last_match(5)
      }, site, post)
    end
        .gsub(OBSIDIAN_LINK_REGEX) do
      build_markdown_link({
        altText: Regexp.last_match(6),
        postName: Regexp.last_match(2),
        externalURL: Regexp.last_match(5),
        rawHeadings: Regexp.last_match(3),
        targetHeading: Regexp.last_match(4)
      }, site, post)
    end
  end

  def build_markdown_link(linkData, site, post)
    # Destructuring Hash to each variables.
    altText, externalURL, postName, rawHeadings, targetHeading =
      linkData.values_at(:altText, :externalURL, :postName, :rawHeadings, :targetHeading)
    # Set innerText of <a> tag by priorities.
    innerText = \
      altText \
        || externalURL \
        || raw_headings_to_innertext((postName || '') + (rawHeadings || '')) \
        || 'Empty Link'
    isInternalLink = postName ? post['title'] == postName : (targetHeading || externalURL&.include?(post.url))

    # Set href property of <a> tag. Check the outlink post name, then Link to desired headings.
    href = \
      externalURL \
        || (if isInternalLink
              (raw_headings_to_href(rawHeadings) || '#')
            else
              link_to_other_post(site.posts, postName, targetHeading)
            end)

    format("[%s](%s)#{'{:target="_blank"}' unless isInternalLink}", innerText || '🔗', href)
  end

  def raw_headings_to_innertext(string)
    string&.sub(/^#/, '')&.gsub(/#+/, '> ')
  end

  def raw_headings_to_href(string)
    string&.downcase&.gsub(/^#+ +/, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+$}, '')&.gsub(%r{^[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '-')
  end

  def link_to_other_post(posts, postName, targetHeading)
    post = posts.docs.filter do |doc|
      doc['title'] == postName || doc.basename.gsub(doc.extname, '') == postName
    end
    if post.length > 1
      raise "ERROR post title: #{postName} => Duplicated posts."
    elsif post.length == 1
      post[0].url + (raw_headings_to_href(targetHeading) || '')
    else
      raise "ERROR post title: #{postName} => No such a post in your website."
    end
  end
end
