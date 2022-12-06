# frozen_string_literal: true

require 'json'

module PreprocessTags
  def set_random_color
    r = rand(255)
    g = rand(255)
    b = rand(255)
    comp_r = 255 - r
    comp_g = 255 - g
    comp_b = 255 - b
    { 'background-color' => "rgb(#{r}, #{g}, #{g})", 'color' => "rgb(#{comp_r}, #{comp_g}, #{comp_b})" }
  end

  def register_tags(article)
    tags = article.data['tags']
    tag_data = File.open('_data/json/tags.json').read
    data = JSON.parse(tag_data != '' ? tag_data : '{}')
    File.open('_data/json/tags.json', 'w') do |file|
      tags.each do |tag|
        next if data.key?(tag.upcase)

        data[tag.upcase] = set_random_color
      end
      file.write(JSON.pretty_generate(data))
    end
  end
end
