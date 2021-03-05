class Sample < ApplicationRecord
  belongs_to :project
  validates :sample_name, presence: true, uniqueness: { 
    message: ->(object, data) do
      "Sample #{data[:value]} already exists. "
    end
  }, on: :create

  def self.import(file, id)
    CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
      sample = find_by_sample_name(row['sample_name'])|| new
      sample.attributes = row.to_hash.slice(*column_names)
      sample.project_id = id
      sample.save!
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

  def self.import_all(file)
    CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
      sample = find_by_sample_name(row['sample_name'])|| new
      sample.attributes = row.to_hash.slice(*column_names)
      pname = sample.project_name
      project = Project.find_by(name: pname)
      sample.project_id = project.id
      project.update_attribute(:num_of_samples, project.samples.count)
      sample.save!
    end
  end


end
