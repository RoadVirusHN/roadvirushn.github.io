# frozen_string_literal: true
require_relative './frontmatter/preprocess_tags'
require_relative './frontmatter/preprocess_categories'
require 'json'

module PreprocessFrontmatter
  def prevent_liquid(str)
    "{% raw %}\n#{str}\n{% endraw %}"
  end

  def register_articles(articles)
    articles_data = File.open('_data/json/articles.json').read
    data = JSON.parse(articles_data != '' ? articles_data : '{}')
    changed = update_articles_data(data, articles)
    if changed
      File.open('_data/json/articles.json', 'w') do |file|
        file.write(JSON.pretty_generate(data))
      end
    end
    changed
  end

  def update_articles_data(data, articles)
    changed = false
    articles.docs.each do |article|
      new_data = build_article_info(article)
      article_id = article.url.encode('utf-8')
      if !data.key?(article_id) || data[article_id] != new_data
        data[article_id] = new_data
        changed = true
      end
    end
    changed
  end

  def build_article_info(article)
    article_data = article.data
    {
      'title' => article_data['title'].encode('utf-8'),
      'date' => article_data['date'].to_s.encode('utf-8'),
      'path' => article.path.encode('utf-8').gsub(%r{(.*)(/_articles/.*)}) { |_matched| Regexp.last_match(2) },
      'tags' => article_data['tags'].map do |tag|
        tag.upcase.encode('utf-8')
      end
    }
  end
  include PreprocessTags
  include PreprocessCategories
end
