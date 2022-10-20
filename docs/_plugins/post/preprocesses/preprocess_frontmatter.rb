# frozen_string_literal: true

require 'json'

module PreprocessFrontmatter
  def set_random_color
    r = rand(255)
    g = rand(255)
    b = rand(255)
    comp_r = 255 - r
    comp_g = 255 - g
    comp_b = 255 - b
    { 'background-color' => "rgb(#{r}, #{g}, #{g})", 'color' => "rgb(#{comp_r}, #{comp_g}, #{comp_b})" }
  end

  def register_categories(post)
    categories = post.data['categories']
    data = JSON.parse(File.open('_data/json/categories.json').read)

    File.open('_data/json/categories.json', 'w') do |file|
      categories.each do |category|
        next if data.key?(category.upcase)

        data[category.upcase] = set_random_color
      end

      file.write(JSON.pretty_generate(data))
    end
  end
end
