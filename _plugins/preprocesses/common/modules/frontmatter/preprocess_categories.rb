require 'json'

module PreprocessCategories
  def create_category_pages(site)
    data = JSON.parse(File.open('_data/json/categories.json').read)
    create_category_page_recursive(site, [], data)
  end

  def create_category_page_recursive(site, categories, data)
    result = data['categories'].keys.inject([]) do |memo, sub_category|
      memo + create_category_page_recursive(site, categories + [sub_category], data['categories'][sub_category])
    end
    if categories.empty?
      result
    else
      [CategoryPage.new(site, categories, data)] + result
    end
  end
  

  def clear_categories
    File.open('_data/json/categories.json', 'w') do |file|
      data = { 'categories' => {}, 'posts' => [] }
      file.write(JSON.pretty_generate(data))
    end
  end

  def register_categories(post)
    post.path.match(%r{_posts/(.+)/[^/]+\.(?:(?:md)|(?:markdown))}) do |_matched|
      categories = Regexp.last_match(1).split('/')
      post.data['categories'] = categories
      update_categories_json(categories, post)
    end
    post
  end

  def update_categories_json(categories, post)
    data = JSON.parse(File.open('_data/json/categories.json').read)
    File.open('_data/json/categories.json', 'w') do |file|
      update_categories_data(data, categories, post)
      file.write(JSON.pretty_generate(data))
    end
  end

  def update_categories_data(data, categories, post)
    data_recursive = data
    categories.each_with_index do |category, index|
      category_upcase = category.upcase
      unless data_recursive['categories'].key?(category_upcase)
        data_recursive['categories'][category_upcase] = { 'categories' => {}, 'posts' => [] }
      end
      data_recursive = data_recursive['categories'][category_upcase]
      data_recursive['posts'].push(post.url) if index == categories.size - 1
    end
  end
end

# Subclass of `Jekyll::Page` with custom method definition
# rubocop:disable Metrics/MethodLength(RuboCop) 
# rubocop:disable Metrics/AbcSize(RuboCop)
# rubocop:disable Lint/MissingSuper(RuboCop)
class CategoryPage < Jekyll::Page
  def initialize(site, categories, data)
    posts_data = JSON.parse(File.open('_data/json/posts.json').read)
    @site = site             # the current site instance.
    @base = site.source      # path to the source directory.
    @dir  = categories.inject('/categories/') do |url, category| # the directory the page will reside in.
      url << "#{category}/"
    end

    # All pages have the same filename, so define attributes straight away.
    @basename = 'index' # filename without the extension.
    @ext      = '.html' # the extension.
    @name     = 'index.html' # basically @basename + @ext.

    # Initialize data hash with a key pointing to all posts under current category.
    # This allows accessing the list in a template via `page.linked_docs`.
    @data = {
      'linked_docs' => data['posts'].map do |url|
        posts_data[url]['url'] = url
        posts_data[url]
      end,
      'list_title' => categories.inject("~/") do |url, category| 
        url << "#{category}/"
      end,
      'subdirectories' => data['categories'].keys.map do |category|
        { 'url' => @dir + "#{category}/",
          'name' => category,
          'posts' => { 'size' => data['categories'][category]['posts'].length },
          'categories' => { 'size' => data['categories'][category]['categories'].length } }
      end
    }
    @content = File.open('_layouts/category_page.html').read
    # Look up front matter defaults scoped to type `categories`, if given key
    # doesn't exist in the `data` hash.
    data.default_proc = proc do |_, key|
      site.frontmatter_defaults.find(relative_path, :categories, key)
    end
  end

  # Placeholders that are used in constructing page URL.
  def url_placeholders
    {
      category: @dir,
      basename: basename,
      output_ext: output_ext,
      path: @dir
    }
  end
end
# rubocop:enalbe Metrics/MethodLength(RuboCop)
# rubocop:enable Metrics/AbcSize(RuboCop)
# rubocop:enable Lint/MissingSuper(RuboCop)
