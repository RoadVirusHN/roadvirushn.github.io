# frozen_string_literal: true

module PreprocessHeadings
  OBSIDIAN_TOC_REGEX = /(?:\[TOC\])|(?:\* TOC\n\{:toc\})(?=[^`]*(?:`[^`]*`[^`]*)*\Z)/i
  MARKDOWN_HEADINGS = /(?<headings>^#+[^#\n]+(?=[^`]*(?:`[^`]*`[^`]*)*\Z))/m

  def convert_toc_formats(str)
    generate_headings_id(str.gsub(OBSIDIAN_TOC_REGEX) do |_matched|
      '```TOC\n```'
    end)
  end

  def text_to_custom_id(str)
    str&.downcase&.gsub(/^#+ +/, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+$}, '')&.gsub(%r{^[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '')&.gsub(%r{[!@$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]+}, '-')
  end

  def generate_headings_id(str)
    str.gsub(MARKDOWN_HEADINGS) do |_matched|
      headings = Regexp.last_match(1)
      custom_id = text_to_custom_id(headings)
      "#{headings}\n{: ##{custom_id}}"
    end
  end
end
