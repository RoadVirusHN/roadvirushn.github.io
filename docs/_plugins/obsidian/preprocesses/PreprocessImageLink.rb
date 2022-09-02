module PreprocessImageLink
  OBSIDIAN_IMAGE_LINK_REGEX = %r{!\[\[(?:(?!https?://)(?:.*/)?([^\[\]|]+\.[a-z]{3,4}))??(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_+.~#?&/=]*))?(?:\|(.*))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*\Z)}
  MARKDOWN_IMAGE_LINK_REGEX = %r{!\[(?:([^\[\]|]+))?\]\((?:(?!https?://)(?:.*/)?([^\[\]|]+\.[a-z]{3,4}))?(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_+.~#?&/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*\Z)}

  def build_markdown_img(linkData, static_dir)
    staticImgDir = static_dir + '/' + (linkData[:staticImgFile] || '')

    src = linkData[:externalURL] || staticImgDir

    format('![%s](%s)', linkData[:altText], src)
  end
    
  def convert_image_link(post)
    static_dir = '/' + Jekyll.configuration({})['static_img_dir'] + '/' + post.date.strftime('%Y-%m-%d') + '-' + post['slug']
    post.content
        .gsub(MARKDOWN_IMAGE_LINK_REGEX)  do |_matched|
      matched = build_markdown_img({
                                     altText: Regexp.last_match(1),
                                     staticImgFile: Regexp.last_match(2)&.gsub('%20', ' '),
                                     externalURL: Regexp.last_match(3)
                                   }, static_dir)
    end
        .gsub(OBSIDIAN_IMAGE_LINK_REGEX)  do |_matched|
      matched = build_markdown_img({
                                     staticImgFile: Regexp.last_match(1),
                                     externalURL: Regexp.last_match(2),
                                     altText: Regexp.last_match(3)
                                   }, static_dir)
    end
  end
end
