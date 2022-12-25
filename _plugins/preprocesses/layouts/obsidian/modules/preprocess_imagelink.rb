# frozen_string_literal: true

module PreprocessImageLink
  OBSIDIAN_IMAGE_LINK_REGEX = %r{!\[\[(?:(?!https?://)(?:.*/)?([^\[\]|]+\.[a-z]{3,4}))??(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_+.~#?&/=]*))?(?:\|(.*))?\]\](?=[^`]*(?:`[^`]*`[^`]*)*\Z)}
  MARKDOWN_IMAGE_LINK_REGEX = %r{!\[(?:([^\[\]|]+))?\]\((?:(?!https?://)(?:.*/)?([^\[\]|]+\.[a-z]{3,4}))?(https?://(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9(@:%_+.~#?&/=]*))?\)(?=[^`]*(?:`[^`]*`[^`]*)*\Z)}

  def build_markdown_img(link_data, static_dir)
    static_img_dir = "#{static_dir}/#{link_data[:static_img_file] || ''}"

    src = link_data[:external_URL] || static_img_dir

    "![#{link_data[:alt_text]}](#{src})"
  end

  # rubocop:disable Metrics/MethodLength(RuboCop)
  # rubocop:disable Metrics/AbcSize(RuboCop)
  def convert_imagelink(article)
    static_dir = "/assets/img/#{article['slug']}"
    article.content = article.content
        .gsub(MARKDOWN_IMAGE_LINK_REGEX) do |_matched|
      build_markdown_img({
                           altText: Regexp.last_match(1),
                           static_img_file: Regexp.last_match(2)&.gsub('%20', ' '),
                           external_URL: Regexp.last_match(3)
                         }, static_dir)
    end
    article.content.gsub(OBSIDIAN_IMAGE_LINK_REGEX) do |_matched|
      build_markdown_img({
                           static_img_file: Regexp.last_match(1),
                           external_URL: Regexp.last_match(2),
                           alt_text: Regexp.last_match(3)
                         }, static_dir)
    end
  end
  # rubocop:enable Metrics/MethodLength(RuboCop)
  # rubocop:enable Metrics/AbcSize(RuboCop)
end
