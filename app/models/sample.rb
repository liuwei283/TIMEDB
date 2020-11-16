class Sample < ApplicationRecord
  belongs_to :project
  validates :sample_name, presence: true, uniqueness: { 
    message: ->(object, data) do
      "Sample #{data[:value]} already exists. "
    end
  }, on: :create

  def self.import(file, id)
    CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
      h = row.to_hash
      h[:project_id] = id
      Sample.create! h
    end
  end

  def self.to_csv(options={})
    CSV.generate(options) do |csv|
      csv << column_names
      all.each do |sample|
        csv << sample.attributes.values_at(*column_names)
      end
    end
  end

  def self.selected_to_csv(sample_ids, options={})
    CSV.generate(options) do |csv|
      csv << column_names
      sample_ids.each do |id|
        sample = Sample.find(id)
        csv << sample.attributes.values_at(*column_names)
      end
    end
  end

end
